import { useState, useEffect } from "react";
import "./ReviewsSection.css";

/**
 * Componente ReviewsSection - Seção de avaliações do Google Meu Negócio
 *
 * Integra com Google Places API para exibir avaliações reais do Google
 * Usa Place ID da Fênix Cred para buscar avaliações
 */
function ReviewsSection({ variant = "default" }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const googleReviewsUrl = `https://www.google.com/maps/place/?q=place_id:${import.meta.env.VITE_FENIX_PLACE_ID}`;

  useEffect(() => {
    const placeId = import.meta.env.VITE_FENIX_PLACE_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!placeId) {
      setError("Place ID não configurado. Configure VITE_FENIX_PLACE_ID no arquivo .env");
      setLoading(false);
      return;
    }

    if (!apiKey) {
      setError("Google Maps API Key não configurada. Configure VITE_GOOGLE_MAPS_API_KEY no arquivo .env");
      setLoading(false);
      return;
    }

    // Place ID válido do Google geralmente começa com "ChIJ".
    // Valor apenas numérico costuma ser CID e não funciona em getDetails(placeId).
    if (!/^ChIJ/i.test(placeId)) {
      setError(
        "Place ID inválido. Use o Place ID do Google (formato começa com 'ChIJ'), não CID numérico."
      );
      setLoading(false);
      return;
    }

    // Carregar script do Google Maps JavaScript API
    const waitForPlacesReady = (timeoutMs = 12000) => {
      return new Promise((resolve, reject) => {
        const startedAt = Date.now();
        const tick = () => {
          if (
            window.google &&
            window.google.maps &&
            window.google.maps.places &&
            window.google.maps.places.PlacesService
          ) {
            resolve();
            return;
          }

          if (Date.now() - startedAt > timeoutMs) {
            reject(new Error("Biblioteca Places não disponível após carregamento da API."));
            return;
          }

          window.setTimeout(tick, 120);
        };

        tick();
      });
    };

    const loadGoogleMapsScript = () => {
      return new Promise((resolve, reject) => {
        // Verificar se o script + biblioteca places já foram carregados
        if (
          window.google &&
          window.google.maps &&
          window.google.maps.places &&
          window.google.maps.places.PlacesService
        ) {
          resolve();
          return;
        }

        const existingScript = document.querySelector(
          'script[src*="maps.googleapis.com/maps/api/js"]'
        );

        if (existingScript) {
          existingScript.addEventListener(
            "load",
            () => {
              waitForPlacesReady().then(resolve).catch(reject);
            },
            { once: true }
          );
          existingScript.addEventListener(
            "error",
            () => reject(new Error("Erro ao carregar Google Maps API")),
            { once: true }
          );
          return;
        }

        const callbackName = `__initGoogleMapsPlaces_${Date.now()}`;
        window[callbackName] = () => {
          delete window[callbackName];
          waitForPlacesReady().then(resolve).catch(reject);
        };

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&callback=${callbackName}`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          delete window[callbackName];
          reject(new Error("Erro ao carregar Google Maps API"));
        };
        document.head.appendChild(script);
      });
    };

    const ensurePlacesLibrary = async () => {
      // Suporte à API mais nova
      if (window.google?.maps?.importLibrary) {
        try {
          await window.google.maps.importLibrary("places");
        } catch {
          // tenta fallback abaixo
        }
      }

      if (
        !window.google?.maps?.places ||
        !window.google?.maps?.places?.PlacesService
      ) {
        throw new Error(
          "Biblioteca Places não disponível. Ative Maps JavaScript API + Places API e verifique restrições da API key."
        );
      }
    };

    // Buscar detalhes do lugar
    const fetchPlaceDetails = async () => {
      try {
        await loadGoogleMapsScript();
        await ensurePlacesLibrary();

        const serviceContainer = document.createElement("div");
        serviceContainer.style.display = "none";
        document.body.appendChild(serviceContainer);

        const service = new window.google.maps.places.PlacesService(serviceContainer);
        let hasResolved = false;
        const callbackTimeout = window.setTimeout(() => {
          if (!hasResolved) {
            hasResolved = true;
            if (serviceContainer.parentNode) {
              serviceContainer.parentNode.removeChild(serviceContainer);
            }
            setError(
              "Timeout ao buscar avaliações do Google. Verifique API Key, faturamento e restrições de domínio."
            );
            setLoading(false);
          }
        }, 12000);

        service.getDetails(
          {
            placeId: placeId,
            fields: ["reviews", "rating", "user_ratings_total", "name"],
          },
          (place, status) => {
            if (hasResolved) return;
            hasResolved = true;
            window.clearTimeout(callbackTimeout);
            document.body.removeChild(serviceContainer);

            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              if (place.reviews && place.reviews.length > 0) {
                // Pegar as 5 avaliações mais recentes ou de maior relevância
                const sortedReviews = place.reviews
                  .sort((a, b) => {
                    // Priorizar avaliações mais recentes
                    if (a.time && b.time) {
                      return b.time - a.time;
                    }
                    return 0;
                  })
                  .slice(0, 5);

                setReviews(sortedReviews);
                setRating(place.rating);
                setTotalRatings(place.user_ratings_total);
              } else {
                setError("Nenhuma avaliação encontrada");
              }
            } else {
              setError(`Erro ao buscar avaliações: ${status}`);
            }
            setLoading(false);
          }
        );
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, []);

  // Função para formatar data da avaliação
  const formatDate = (time) => {
    if (!time) return "";
    const date = new Date(time * 1000);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Função para renderizar estrelas
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star star-full">
          ⭐
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star star-half">
          ⭐
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star star-empty">
          ⭐
        </span>
      );
    }

    return stars;
  };

  return (
    <section
      id="depoimentos"
      className={`reviews-section ${variant === "clt" ? "reviews-section-clt" : ""}`}
    >
      <div className="reviews-container">
        <div className="reviews-header">
          <h2 className="section-title">O que nossos clientes dizem</h2>
          <p className="section-subtitle">
            Avaliações reais do Google Meu Negócio - Mais de 90 mil clientes satisfeitos confiam na Fênix Cred
          </p>
        </div>

        {loading && (
          <div className="reviews-loading">
            <div className="loading-spinner"></div>
            <p>Carregando avaliações...</p>
          </div>
        )}

        {error && (
          <div className="reviews-error">
            <p>{error}</p>
            <p className="error-hint">
              Verifique: VITE_FENIX_PLACE_ID, VITE_GOOGLE_MAPS_API_KEY, Maps JavaScript API, Places API, billing e restrições da chave.
            </p>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <>
            {/* Resumo de avaliações */}
            <div className="reviews-summary">
              <div className="summary-rating">
                <div className="rating-number">{rating?.toFixed(1)}</div>
                <div className="rating-stars">
                  {renderStars(rating)}
                </div>
                <div className="rating-total">
                  {totalRatings} avaliações no Google
                </div>
              </div>
            </div>

            {/* Grid de avaliações */}
            <div className="reviews-grid">
              {reviews.slice(0, 4).map((review, index) => (
                <a
                  key={index}
                  className="review-card review-card-link"
                  data-spotlight
                  href={googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver avaliação de ${review.author_name || "Cliente"} no Google`}
                >
                  <div className="review-header">
                    <div className="review-author">
                      {review.profile_photo_url ? (
                        <img
                          src={review.profile_photo_url}
                          alt={`Avatar de ${review.author_name || 'Cliente'}`}
                          className="review-avatar"
                          loading="lazy"
                          decoding="async"
                          width="48"
                          height="48"
                        />
                      ) : (
                        <div className="review-avatar-placeholder">
                          {review.author_name?.charAt(0) || "?"}
                        </div>
                      )}
                      <div className="review-author-info">
                        <h3 className="review-author-name">
                          {review.author_name || "Cliente"}
                        </h3>
                        <p className="review-date">
                          {formatDate(review.time)}
                        </p>
                      </div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                  {review.relative_time_description && (
                    <p className="review-time">
                      {review.relative_time_description}
                    </p>
                  )}
                </a>
              ))}
            </div>

            <div className="reviews-more-link">
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="google-link"
              >
                Ver mais no Google
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                </svg>
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ReviewsSection;

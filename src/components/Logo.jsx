import "./Logo.css";

/**
 * Componente Logo - Logo da Fênix Cred
 *
 * Componente reutilizável que exibe o logo da empresa
 * Pode ser usado em diferentes tamanhos através da prop 'size'
 *
 * Tamanhos disponíveis: 'small', 'medium', 'large', 'xlarge'
 *
 * ============================================
 * INSTRUÇÕES PARA ADICIONAR O LOGO REAL:
 * ============================================
 * 1. Coloque sua imagem do logo em: src/assets/
 *    Nome do arquivo: logo-fenix-cred.png (ou .jpg, .svg)
 *
 * 2. Descomente a linha do formato da sua imagem abaixo
 *    e comente/remova as outras linhas de import
 * ============================================
 */

// Import do logo da Fênix Cred e versões responsivas
// NOTA: Execute 'npm run optimize-images' para criar as versões otimizadas
// Se as imagens não existirem, o build falhará - isso é intencional para garantir otimização
import logoImage from "../assets/logo-fenix-cred.webp";
import logoImage180w from "../assets/logo-fenix-cred-180w.webp";
import logoImage240w from "../assets/logo-fenix-cred-240w.webp";
import logoImage299w from "../assets/logo-fenix-cred-299w.webp";
import logoImage598w from "../assets/logo-fenix-cred-598w.webp";

function Logo({ size = "medium", className = "" }) {
  // Se o logo não foi importado, mostra um placeholder
  if (!logoImage) {
    return (
      <div className={`logo-container ${className}`}>
        <div className={`logo-placeholder logo-${size}`}>
          <span>Fênix Cred</span>
        </div>
      </div>
    );
  }

  // Dimensões baseadas no tamanho
  const dimensions = {
    small: { width: 120, height: 35, srcset: logoImage180w },
    medium: { width: 180, height: 53, srcset: logoImage240w },
    large: { width: 300, height: 88, srcset: logoImage299w },
    xlarge: { width: 400, height: 117, srcset: logoImage598w },
  };

  const { width, height, srcset } = dimensions[size] || dimensions.medium;

  return (
    <div className={`logo-container ${className}`}>
      <picture>
        {/* Mobile: até 640px */}
        <source
          srcSet={`${logoImage180w} 1x, ${logoImage240w} 2x`}
          media="(max-width: 640px)"
          type="image/webp"
        />
        {/* Tablet: 641px - 1024px */}
        <source
          srcSet={`${logoImage240w} 1x, ${logoImage299w} 2x`}
          media="(min-width: 641px) and (max-width: 1024px)"
          type="image/webp"
        />
        {/* Desktop: 1025px+ */}
        <source
          srcSet={`${logoImage299w} 1x, ${logoImage598w} 2x`}
          media="(min-width: 1025px)"
          type="image/webp"
        />
        {/* Fallback para navegadores sem suporte a picture */}
        <img
          src={srcset}
          srcSet={`${logoImage180w} 180w, ${logoImage240w} 240w, ${logoImage299w} 299w, ${logoImage598w} 598w`}
          sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 299px"
          alt="Fênix Cred – correspondente bancário de crédito consignado em São Paulo"
          className={`logo-image logo-${size}`}
          loading="eager"
          decoding="async"
          width={width}
          height={height}
        />
      </picture>
    </div>
  );
}

export default Logo;

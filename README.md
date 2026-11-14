# JM Uniformes — website

Site institucional da JM Uniformes (Viana, Luanda): catálogo, processo, pedido de orçamento via WhatsApp e configurador 3D de uniformes.

**Pré-visualização:** https://airesmiguens.github.io/jm-uniformes/

## Desenvolvimento

```bash
npm install
npm run dev -- -p 3005   # http://localhost:3005
```

- Dados da empresa (contactos, produtos, tecidos, termos): `src/lib/site.ts`
- Configurador 3D (`/personalizar`): `src/components/configurator/`, dados em `src/lib/configurator.ts`
- Fotos: `public/images/equipa.jpg` e `public/images/fabrica.jpg` (substituir por fotos reais com o mesmo nome)

## Publicação

Cada `push` para `main` publica o site no GitHub Pages (`.github/workflows/deploy.yml`).
O site é exportado como HTML estático (`output: "export"`), servido em `/jm-uniformes/`.

## Antes do lançamento oficial

- Retirar `robots: { index: false }` em `src/app/layout.tsx` para o site aparecer no Google.
- Substituir as fotos geradas por IA por fotos reais da equipa e da fábrica.
- Adicionar logótipos reais de clientes (com autorização).

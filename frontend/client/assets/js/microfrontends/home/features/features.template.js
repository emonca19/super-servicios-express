export const homeFeaturesTemplate = (features = []) => `
  <section class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <p class="text-sm uppercase tracking-[0.3em] text-blue-500 mb-4">Valor agregado</p>
        <h2 class="text-4xl font-bold text-gray-800 mb-4">&iquest;Por qu&eacute; elegirnos?</h2>
        <p class="text-lg text-gray-600">Nos destacamos por nuestro compromiso con la excelencia</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${features
          .map(
            (f) =>
              `<feature-card icon-type="${f.icon || ''}" title="${f.title || ''}" description="${f.description || ''}"></feature-card>`
          )
          .join('')}
      </div>
    </div>
  </section>
`;

const renderFeature = (feature) => `
  <feature-card
    icon-type="${feature.icon || ''}"
    title="${feature.title || ''}"
    description="${feature.description || ''}"
  ></feature-card>
`;

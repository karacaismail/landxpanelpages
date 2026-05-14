// Türkiye 81 ili (öncelik, ağırlık ve örnek ilçeleri) — listing dağılımı için.

export interface CityFixture {
  name: string;
  weight: number;
  lat: number;
  lng: number;
  districts: string[];
}

export const TR_CITIES: CityFixture[] = [
  { name: 'İstanbul', weight: 18, lat: 41.0082, lng: 28.9784, districts: ['Beykoz', 'Şile', 'Sarıyer', 'Çatalca', 'Silivri', 'Pendik', 'Tuzla', 'Arnavutköy', 'Eyüpsultan', 'Beylikdüzü'] },
  { name: 'Ankara', weight: 9, lat: 39.9334, lng: 32.8597, districts: ['Çankaya', 'Yenimahalle', 'Etimesgut', 'Polatlı', 'Beypazarı', 'Sincan', 'Kazan', 'Akyurt'] },
  { name: 'İzmir', weight: 7, lat: 38.4192, lng: 27.1287, districts: ['Urla', 'Çeşme', 'Seferihisar', 'Selçuk', 'Foça', 'Aliağa', 'Bergama', 'Menemen'] },
  { name: 'Antalya', weight: 6, lat: 36.8969, lng: 30.7133, districts: ['Kaş', 'Kalkan', 'Manavgat', 'Serik', 'Alanya', 'Kemer', 'Demre', 'Kumluca'] },
  { name: 'Muğla', weight: 5, lat: 37.2154, lng: 28.3636, districts: ['Bodrum', 'Fethiye', 'Marmaris', 'Datça', 'Milas', 'Köyceğiz', 'Dalaman'] },
  { name: 'Bursa', weight: 5, lat: 40.1885, lng: 29.0610, districts: ['İznik', 'Mudanya', 'Orhangazi', 'Gemlik', 'Yenişehir', 'Karacabey'] },
  { name: 'Balıkesir', weight: 4, lat: 39.6484, lng: 27.8826, districts: ['Edremit', 'Ayvalık', 'Burhaniye', 'Erdek', 'Gönen', 'Bandırma'] },
  { name: 'Kocaeli', weight: 4, lat: 40.8533, lng: 29.8815, districts: ['İzmit', 'Kandıra', 'Gebze', 'Karamürsel'] },
  { name: 'Aydın', weight: 4, lat: 37.8480, lng: 27.8456, districts: ['Kuşadası', 'Didim', 'Söke', 'Çine', 'Nazilli'] },
  { name: 'Çanakkale', weight: 3, lat: 40.1553, lng: 26.4142, districts: ['Bozcaada', 'Gökçeada', 'Bayramiç', 'Ezine', 'Lapseki'] },
  { name: 'Tekirdağ', weight: 3, lat: 40.9833, lng: 27.5167, districts: ['Marmaraereğlisi', 'Şarköy', 'Saray', 'Çorlu'] },
  { name: 'Sakarya', weight: 3, lat: 40.7569, lng: 30.3781, districts: ['Adapazarı', 'Sapanca', 'Karasu', 'Hendek', 'Akyazı'] },
  { name: 'Yalova', weight: 2, lat: 40.6500, lng: 29.2667, districts: ['Çınarcık', 'Termal', 'Armutlu'] },
  { name: 'Trabzon', weight: 3, lat: 41.0015, lng: 39.7178, districts: ['Sürmene', 'Of', 'Akçaabat', 'Maçka'] },
  { name: 'Eskişehir', weight: 2, lat: 39.7767, lng: 30.5206, districts: ['Sivrihisar', 'Çifteler', 'Mihalıççık'] },
  { name: 'Konya', weight: 3, lat: 37.8746, lng: 32.4932, districts: ['Akşehir', 'Beyşehir', 'Cihanbeyli', 'Karatay', 'Selçuklu'] },
  { name: 'Mersin', weight: 3, lat: 36.8000, lng: 34.6333, districts: ['Anamur', 'Erdemli', 'Silifke', 'Tarsus'] },
  { name: 'Edirne', weight: 2, lat: 41.6818, lng: 26.5623, districts: ['Keşan', 'İpsala', 'Enez', 'Uzunköprü'] },
  { name: 'Manisa', weight: 2, lat: 38.6191, lng: 27.4289, districts: ['Akhisar', 'Salihli', 'Turgutlu', 'Demirci'] },
  { name: 'Denizli', weight: 2, lat: 37.7765, lng: 29.0864, districts: ['Pamukkale', 'Tavas', 'Buldan', 'Sarayköy'] },
  { name: 'Samsun', weight: 2, lat: 41.2867, lng: 36.3300, districts: ['Atakum', 'Bafra', 'Çarşamba'] },
  { name: 'Hatay', weight: 2, lat: 36.4018, lng: 36.3498, districts: ['Antakya', 'İskenderun', 'Samandağ'] },
  { name: 'Kayseri', weight: 1, lat: 38.7312, lng: 35.4787, districts: ['Talas', 'Develi', 'Yahyalı'] },
  { name: 'Gaziantep', weight: 1, lat: 37.0662, lng: 37.3833, districts: ['Şahinbey', 'Nizip', 'Oğuzeli'] },
  { name: 'Şanlıurfa', weight: 1, lat: 37.1591, lng: 38.7969, districts: ['Birecik', 'Halfeti', 'Suruç'] }
];

// Toplam ağırlık 81 modelinin makul örneklemesi.
export function weightedCityPick(rand: () => number): CityFixture {
  const total = TR_CITIES.reduce((s, c) => s + c.weight, 0);
  let pick = rand() * total;
  for (const c of TR_CITIES) {
    pick -= c.weight;
    if (pick <= 0) return c;
  }
  return TR_CITIES[0];
}

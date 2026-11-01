import type { Temple, Offering, Order } from '../types';

export const SEED_TEMPLES: Temple[] = [
  {
    id: 'temple-1',
    name: 'Sabarimala Sree Dharma Sastha Temple',
    location: 'Pathanamthitta, Kerala',
    deity: 'Lord Ayyappa',
    description: 'Ancient hill shrine nestled in the Western Ghats known for pilgrimage and ritual offerings.',
  },
  {
    id: 'temple-2',
    name: 'Guruvayur Sree Krishna Temple',
    location: 'Thrissur, Kerala',
    deity: 'Lord Guruvayurappan (Maha Vishnu)',
    description: 'Renowned pilgrimage destination celebrated as the Bhuloka Vaikunta.',
  },
  {
    id: 'temple-3',
    name: 'Chottanikkara Bhagavathy Temple',
    location: 'Ernakulam, Kerala',
    deity: 'Goddess Rajarajeshwari / Bhadrakali',
    description: 'Eminent temple renowned for divine healing and spiritual peace.',
  },
];

export const SEED_OFFERINGS: Offering[] = [
  // Sabarimala
  {
    id: 'off-101',
    templeId: 'temple-1',
    name: 'Pushpanjali',
    price: 30,
    active: true,
    description: 'Traditional flower offering for health and well-being.',
    category: 'Daily',
  },
  {
    id: 'off-102',
    templeId: 'temple-1',
    name: 'Archana',
    price: 50,
    active: true,
    description: 'Chanting of sacred divine names with holy blossoms.',
    category: 'Archana',
  },
  {
    id: 'off-103',
    templeId: 'temple-1',
    name: 'Neyyabhishekam',
    price: 150,
    active: true,
    description: 'Sacred ghee offering poured over the deity for prosperity.',
    category: 'Abhishekam',
  },
  {
    id: 'off-104',
    templeId: 'temple-1',
    name: 'Aravana Payasam',
    price: 120,
    active: true,
    description: 'Delicious consecrated rice, jaggery and ghee prasadam.',
    category: 'Prasadam',
  },
  {
    id: 'off-105',
    templeId: 'temple-1',
    name: 'Appam Prasadam',
    price: 60,
    active: true,
    description: 'Sweet fried rice cake offered as sanctified naivedyam.',
    category: 'Prasadam',
  },
  {
    id: 'off-106',
    templeId: 'temple-1',
    name: 'Ganapathy Homam',
    price: 200,
    active: true,
    description: 'Vedic fire ceremony invoked at dawn to remove obstacles.',
    category: 'Special',
  },
  {
    id: 'off-107',
    templeId: 'temple-1',
    name: 'Sahasranama Archana',
    price: 250,
    active: true,
    description: 'One thousand sacred names chanted by the temple priest.',
    category: 'Archana',
  },
  {
    id: 'off-108',
    templeId: 'temple-1',
    name: 'Kettunira Vazhipadu',
    price: 100,
    active: true,
    description: 'Ceremonial blessing of the irumudi coconut and travel pack.',
    category: 'Daily',
  },
  {
    id: 'off-109',
    templeId: 'temple-1',
    name: 'Udayastamana Pooja (Fully Booked)',
    price: 5000,
    active: false,
    description: 'Day-long special pooja. Currently inactive / not accepting bookings.',
    category: 'Special',
  },
  {
    id: 'off-110',
    templeId: 'temple-1',
    name: 'Seasonal Makara Vilakku Pooja',
    price: 1500,
    active: false,
    description: 'Off-season ritual not available during ordinary temple hours.',
    category: 'Special',
  },

  // Guruvayur
  {
    id: 'off-201',
    templeId: 'temple-2',
    name: 'Pushpanjali',
    price: 30,
    active: true,
    description: 'Devotional offering of tulsi leaves and flowers.',
    category: 'Daily',
  },
  {
    id: 'off-202',
    templeId: 'temple-2',
    name: 'Archana',
    price: 50,
    active: true,
    description: 'Recitation of Ashtothara Shatha Namavali.',
    category: 'Archana',
  },
  {
    id: 'off-203',
    templeId: 'temple-2',
    name: 'Paal Payasam',
    price: 180,
    active: true,
    description: 'World-famous sweetened milk and rice delicacy.',
    category: 'Prasadam',
  },
  {
    id: 'off-204',
    templeId: 'temple-2',
    name: 'Thulabharam',
    price: 500,
    active: true,
    description: 'Weighing offering with banana, sugar, or coins.',
    category: 'Special',
  },
  {
    id: 'off-205',
    templeId: 'temple-2',
    name: 'Choroonu (First Rice Feeding)',
    price: 350,
    active: true,
    description: 'Auspicious initiation of solid food for infants.',
    category: 'Special',
  },
  {
    id: 'off-206',
    templeId: 'temple-2',
    name: 'Niramala & Vilakku',
    price: 750,
    active: true,
    description: 'Illumination of traditional oil lamps and garlands.',
    category: 'Special',
  },
  {
    id: 'off-207',
    templeId: 'temple-2',
    name: 'Ghee Lamp (Neyvilakku)',
    price: 40,
    active: true,
    description: 'Lighting consecrated earthen ghee lamps in the sanctum.',
    category: 'Daily',
  },
  {
    id: 'off-208',
    templeId: 'temple-2',
    name: 'Bhagavatha Parayanam',
    price: 300,
    active: true,
    description: 'Chanting passages of Srimad Bhagavatam for spiritual grace.',
    category: 'Daily',
  },
  {
    id: 'off-209',
    templeId: 'temple-2',
    name: 'Utsava Bali (Restricted)',
    price: 2500,
    active: false,
    description: 'Ritual during annual festival period only. Closed for public booking.',
    category: 'Special',
  },

  // Chottanikkara
  {
    id: 'off-301',
    templeId: 'temple-3',
    name: 'Pushpanjali',
    price: 30,
    active: true,
    description: 'Raktha Pushpanjali for courage and blessing.',
    category: 'Daily',
  },
  {
    id: 'off-302',
    templeId: 'temple-3',
    name: 'Archana',
    price: 50,
    active: true,
    description: 'Goddess Lalitha Sahasranama Archana offering.',
    category: 'Archana',
  },
  {
    id: 'off-303',
    templeId: 'temple-3',
    name: 'Guruthi Pooja',
    price: 350,
    active: true,
    description: 'Evening ritual performed at Keezhkkavu for divine protection.',
    category: 'Special',
  },
  {
    id: 'off-304',
    templeId: 'temple-3',
    name: 'Bhagavathy Seva',
    price: 450,
    active: true,
    description: 'Traditional tantric ritual conducted after sunset.',
    category: 'Special',
  },
  {
    id: 'off-305',
    templeId: 'temple-3',
    name: 'Thrimadhuram',
    price: 75,
    active: true,
    description: 'Offering of kadali banana, honey, and jaggery.',
    category: 'Prasadam',
  },
  {
    id: 'off-306',
    templeId: 'temple-3',
    name: 'Kumkumarchana',
    price: 80,
    active: true,
    description: 'Vermilion offering for marital peace and happiness.',
    category: 'Archana',
  },
  {
    id: 'off-307',
    templeId: 'temple-3',
    name: 'Vedi Vazhipadu',
    price: 25,
    active: true,
    description: 'Auspicious consecrated sound offering to dispel negativity.',
    category: 'Daily',
  },
  {
    id: 'off-308',
    templeId: 'temple-3',
    name: 'Karthika Vilakku (Annual only)',
    price: 1200,
    active: false,
    description: 'Exclusive to Vrischikam Karthika; inactive for regular booking.',
    category: 'Special',
  },
];

// Helper to generate 52 seeded orders
export function generateSeedOrders(): Order[] {
  const names = [
    'Anandu Krishna', 'Sreehari Nair', 'Lakshmi Menon', 'Gopika Pillai', 'Arjun Varma',
    'Deepa Nambiar', 'Rahul Mohan', 'Anjali Kurup', 'Vineeth Unni', 'Parvathy Warrier',
    'Madhavan K', 'Sarada Devi', 'Harikrishnan R', 'Meera N', 'Naveen Kumar',
    'Aparna S', 'Vishnu Prasad', 'Kavitha P', 'Siddharth M', 'Reshmi R',
  ];

  const stars = [
    'Ashwini (Aswathy)', 'Bharani', 'Rohini', 'Krittika (Karthika)', 'Ardra (Thiruvathira)',
    'Pushya (Pooyam)', 'Hasta (Atham)', 'Swati (Chothi)', 'Anuradha (Anizham)', 'Revati (Revathi)',
  ];

  const phoneNumbers = [
    '9847012345', '9447123456', '9895234567', '9746345678', '9961456789',
    '9496567890', '9846678901', '9020789012', '9539890123', '9656901234',
  ];

  const statuses: Order['status'][] = ['CONFIRMED', 'CONFIRMED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

  const orders: Order[] = [];
  const baseDate = new Date('2026-11-01');

  for (let i = 1; i <= 52; i++) {
    const temple = SEED_TEMPLES[(i - 1) % SEED_TEMPLES.length];
    const devotee = names[(i - 1) % names.length];
    const star = stars[(i - 1) % stars.length];
    const phone = phoneNumbers[(i - 1) % phoneNumbers.length];
    const status = statuses[i % statuses.length];

    // Distribute offering dates around today (past and upcoming)
    const offsetDays = (i % 25) - 10;
    const orderDate = new Date(baseDate);
    orderDate.setDate(orderDate.getDate() + offsetDays);
    const offeringDate = orderDate.toISOString().split('T')[0];

    const templeOfferings = SEED_OFFERINGS.filter((o) => o.templeId === temple.id && o.active);
    const item1 = templeOfferings[i % templeOfferings.length];
    const qty1 = (i % 3) + 1;

    const items = [
      {
        offeringId: item1.id,
        offeringName: item1.name,
        price: item1.price,
        quantity: qty1,
      },
    ];

    if (i % 2 === 0) {
      const item2 = templeOfferings[(i + 2) % templeOfferings.length];
      const qty2 = 1;
      items.push({
        offeringId: item2.id,
        offeringName: item2.name,
        price: item2.price,
        quantity: qty2,
      });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const createdAt = new Date(baseDate.getTime() - i * 3600 * 1000 * 12).toISOString();

    orders.push({
      id: `ORD-2026-${String(1000 + i)}`,
      templeId: temple.id,
      templeName: temple.name,
      devoteeName: devotee,
      phoneNumber: phone,
      nakshatra: star,
      offeringDate,
      items,
      totalAmount,
      status,
      createdAt,
    });
  }

  return orders;
}


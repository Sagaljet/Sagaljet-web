export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phones: string[]; // Changed to array for multiple numbers
  email: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const branches: Branch[] = [
  // Hargeisa Main Office
  {
    id: "hargeisa-main",
    name: "Main Office (Xarunta Guud)",
    address: "Sagal Jet Head Office",
    city: "Hargeisa, Somaliland",
    phones: ["510099", "063 4044400", "065 4044400"],
    email: "info@sagaljet.net",
    hours: "Sun-Thu: 8:00 AM - 6:00 PM",
    coordinates: {
      lat: 9.56,
      lng: 44.065,
    },
  },
  {
    id: "hargeisa-theater",
    name: "Theater Branch (Laanta Tiyaatarka)",
    address: "Sagal Jet Theater Office",
    city: "Hargeisa, Somaliland",
    phones: ["521999", "063 4429714", "065 4429714"],
    email: "sagaljettiyaatarka@gmail.com",
    hours: "Sun-Thu: 8:00 AM - 6:00 PM",
    coordinates: {
      lat: 9.562,
      lng: 44.063,
    },
  },
  {
    id: "hargeisa-guuleed",
    name: "Guuleed Hotel Branch",
    address: "Sagal Jet Guuleed Hotel Office",
    city: "Hargeisa, Somaliland",
    phones: ["527299", "063 3333049", "065 4480148"],
    email: "sagaljetguuleed@gmail.com",
    hours: "Sun-Thu: 8:00 AM - 6:00 PM",
    coordinates: {
      lat: 9.558,
      lng: 44.067,
    },
  },
  {
    id: "hargeisa-dumbuluq",
    name: "Dumbuluq Branch",
    address: "Sagal Jet Dumbuluq Office",
    city: "Hargeisa, Somaliland",
    phones: ["526333", "063 3333968", "065 4853535"],
    email: "sagaljetdumbuluq@gmail.com",
    hours: "Sun-Thu: 8:00 AM - 6:00 PM",
    coordinates: {
      lat: 9.555,
      lng: 44.07,
    },
  },
  {
    id: "hargeisa-xeroawr",
    name: "Xero Awr Branch",
    address: "Sagal Jet Xero Awr Office",
    city: "Hargeisa, Somaliland",
    phones: ["573455", "063 3946666", "065 9967443"],
    email: "sagaljetxeroawr@gmail.com",
    hours: "Sun-Thu: 8:00 AM - 6:00 PM",
    coordinates: {
      lat: 9.565,
      lng: 44.06,
    },
  },
  // Regional Branches
  {
    id: "berbera",
    name: "Berbera Branch",
    address: "Sagal Jet Berbera Office",
    city: "Berbera, Somaliland",
    phones: ["740802", "063 6799997", "065 4044377"],
    email: "sagaljetberbera@gmail.com",
    hours: "Sun-Thu: 8:00 AM - 6:00 PM",
    coordinates: {
      lat: 10.4396,
      lng: 45.0143,
    },
  },
  {
    id: "borama",
    name: "Borama Branch",
    address: "Sagal Jet Borama Office",
    city: "Borama, Somaliland",
    phones: ["610312", "063 4518090", "065 4518090"],
    email: "sagaljetborama@gmail.com",
    hours: "Sun-Thu: 8:00 AM - 6:00 PM",
    coordinates: {
      lat: 9.936,
      lng: 43.182,
    },
  },
  {
    id: "burao",
    name: "Burao Branch",
    address: "Sagal Jet Burao Office",
    city: "Burao, Somaliland",
    phones: ["717823", "065 9635555", "063 4966668"],
    email: "sagaljetburco@gmail.com",
    hours: "Sun-Thu: 8:00 AM - 6:00 PM",
    coordinates: {
      lat: 9.5275,
      lng: 45.5347,
    },
  },
  {
    id: "cerigabo",
    name: "Cerigabo Branch",
    address: "Sagal Jet Cerigabo Office",
    city: "Cerigabo, Somaliland",
    phones: ["063 8099960", "063 4202171", "065 9000911"],
    email: "sagaljetceerigaabo@gmail.com",
    hours: "Sun-Thu: 8:00 AM - 6:00 PM",
    coordinates: {
      lat: 10.6163,
      lng: 47.3671,
    },
  },
  {
    id: "gabiley",
    name: "Gabiley Branch",
    address: "Sagal Jet Gabiley Office",
    city: "Gabiley, Somaliland",
    phones: ["624888", "063 4404140", "065 9512222"],
    email: "sagaljetgabiley@gmail.com",
    hours: "Sun-Thu: 8:00 AM - 6:00 PM",
    coordinates: {
      lat: 9.65,
      lng: 43.65,
    },
  },
  {
    id: "wajale",
    name: "Wajale Branch",
    address: "Sagal Jet Wajale Office",
    city: "Wajale, Somaliland",
    phones: ["644125", "063 4404140", "065 9512222"],
    email: "sagaljetwajaale@gmail.com",
    hours: "Sun-Thu: 8:00 AM - 6:00 PM",
    coordinates: {
      lat: 9.6,
      lng: 43.3667,
    },
  },
];
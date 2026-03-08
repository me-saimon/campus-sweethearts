export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  university: string;
  department: string;
  year: string;
  bio: string;
  interests: string[];
  avatar: string;
  location: string;
  religion: string;
  lookingFor: string;
}

export const mockProfiles: StudentProfile[] = [
  {
    id: "1",
    name: "Ayesha Rahman",
    age: 22,
    university: "Dhaka University",
    department: "English Literature",
    year: "4th Year",
    bio: "Passionate about poetry and literature. Looking for someone who values education and family.",
    interests: ["Reading", "Writing", "Cooking", "Travel"],
    avatar: "",
    location: "Dhaka",
    religion: "Islam",
    lookingFor: "Life partner who shares similar values",
  },
  {
    id: "2",
    name: "Rafiq Ahmed",
    age: 24,
    university: "BUET",
    department: "Computer Science",
    year: "Masters",
    bio: "Software engineer with a love for innovation. Family-oriented and ambitious.",
    interests: ["Technology", "Cricket", "Photography", "Hiking"],
    avatar: "",
    location: "Dhaka",
    religion: "Islam",
    lookingFor: "Someone kind, educated, and family-oriented",
  },
  {
    id: "3",
    name: "Fatima Noor",
    age: 21,
    university: "Jahangirnagar University",
    department: "Pharmacy",
    year: "3rd Year",
    bio: "Future pharmacist with a caring heart. Love spending time with family.",
    interests: ["Medicine", "Gardening", "Calligraphy", "Volunteering"],
    avatar: "",
    location: "Savar",
    religion: "Islam",
    lookingFor: "A responsible and caring partner",
  },
  {
    id: "4",
    name: "Imran Hossain",
    age: 23,
    university: "Chittagong University",
    department: "Business Administration",
    year: "4th Year",
    bio: "Aspiring entrepreneur focused on making a difference. Values honesty and kindness.",
    interests: ["Business", "Football", "Music", "Reading"],
    avatar: "",
    location: "Chittagong",
    religion: "Islam",
    lookingFor: "A supportive life partner",
  },
  {
    id: "5",
    name: "Sumaiya Khan",
    age: 22,
    university: "Rajshahi University",
    department: "Fine Arts",
    year: "4th Year",
    bio: "Artist at heart. Believe in the beauty of simple things and meaningful connections.",
    interests: ["Painting", "Music", "Nature", "Cooking"],
    avatar: "",
    location: "Rajshahi",
    religion: "Islam",
    lookingFor: "Someone who appreciates creativity",
  },
  {
    id: "6",
    name: "Tanvir Alam",
    age: 25,
    university: "NSU",
    department: "Electrical Engineering",
    year: "Masters",
    bio: "Engineer by profession, poet by heart. Looking for someone to share life's journey.",
    interests: ["Engineering", "Poetry", "Travelling", "Chess"],
    avatar: "",
    location: "Dhaka",
    religion: "Islam",
    lookingFor: "A thoughtful and educated partner",
  },
];

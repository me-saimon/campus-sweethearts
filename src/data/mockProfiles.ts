export interface Endorsement {
  id: string;
  endorserName: string;
  endorserUniversity: string;
  endorserDepartment: string;
  endorserYear: string;
  relationship: "classmate" | "batchmate" | "department_peer" | "university_peer";
  rating: number;
  comment: string;
  date: string;
}

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
  endorsements: Endorsement[];
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
    endorsements: [
      { id: "e1", endorserName: "Nusrat Jahan", endorserUniversity: "Dhaka University", endorserDepartment: "English Literature", endorserYear: "4th Year", relationship: "classmate", rating: 5, comment: "Ayesha is one of the most genuine and kind-hearted people I know. Very family-oriented and sincere in her deen.", date: "2026-02-15" },
      { id: "e2", endorserName: "Tasnim Akter", endorserUniversity: "Dhaka University", endorserDepartment: "History", endorserYear: "4th Year", relationship: "batchmate", rating: 4, comment: "Known her since 1st year. She's very honest, well-mannered, and comes from a great family.", date: "2026-01-20" },
    ],
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
    endorsements: [
      { id: "e3", endorserName: "Kamal Hasan", endorserUniversity: "BUET", endorserDepartment: "Computer Science", endorserYear: "Masters", relationship: "classmate", rating: 5, comment: "Rafiq is a brilliant mind with a humble heart. Very practicing Muslim and respectful to everyone.", date: "2026-03-01" },
    ],
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
    endorsements: [
      { id: "e4", endorserName: "Mariam Begum", endorserUniversity: "Jahangirnagar University", endorserDepartment: "Pharmacy", endorserYear: "3rd Year", relationship: "classmate", rating: 5, comment: "Fatima is incredibly dedicated to her studies and her faith. Always helps others selflessly.", date: "2026-02-28" },
      { id: "e5", endorserName: "Sabina Yasmin", endorserUniversity: "Jahangirnagar University", endorserDepartment: "Microbiology", endorserYear: "3rd Year", relationship: "batchmate", rating: 5, comment: "A truly wonderful person. MashaAllah, her character speaks for itself.", date: "2026-01-10" },
      { id: "e6", endorserName: "Razia Sultana", endorserUniversity: "Jahangirnagar University", endorserDepartment: "Pharmacy", endorserYear: "4th Year", relationship: "department_peer", rating: 4, comment: "Very polite and well-mannered. Great family background.", date: "2025-12-05" },
    ],
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
    endorsements: [],
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
    endorsements: [
      { id: "e7", endorserName: "Farhana Islam", endorserUniversity: "Rajshahi University", endorserDepartment: "Fine Arts", endorserYear: "4th Year", relationship: "classmate", rating: 5, comment: "Sumaiya is incredibly talented and humble. She's the kind of person everyone admires.", date: "2026-02-10" },
    ],
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
    endorsements: [
      { id: "e8", endorserName: "Shakil Rahman", endorserUniversity: "NSU", endorserDepartment: "Electrical Engineering", endorserYear: "Masters", relationship: "classmate", rating: 4, comment: "Tanvir is very knowledgeable and well-spoken. A trustworthy person with good values.", date: "2026-01-25" },
      { id: "e9", endorserName: "Fahim Chowdhury", endorserUniversity: "NSU", endorserDepartment: "CSE", endorserYear: "Masters", relationship: "university_peer", rating: 5, comment: "Known him for years. MashaAllah, one of the most sincere people you'll ever meet.", date: "2026-02-20" },
    ],
  },
];


import TeamPageHeader from "../components/TeamPageHeader";
import EachTeam from "../components/EachTeam";
import "./Team.css";

import anmol_img1 from "../assets/Teams/TechTeam/ANMOL SINGH.jpeg"
import anshu from "../assets/Teams/TechTeam/ANSHU PRIYA.JPG"
import pratham from "../assets/Teams/TechTeam/PRATHAM SHARMA.jpeg"
import renvat from "../assets/Teams/TechTeam/RENVAT RAM.jpeg"
import vidisha from "../assets/Teams/TechTeam/VIDISHA BHARATI.jpeg"
import anmol_img2 from "../assets/Teams/TechTeam/ANMOL KUMAR.jpg"
import navya from "../assets/Teams/TechTeam/NAVYA BARNWAL.jpeg";


import akshat from "../assets/Teams/PR/AKSHAT KESHRI.jpg"
import anupriya from "../assets/Teams/PR/ANUPRIYA SINGH.jpg"
import anvesha from "../assets/Teams/PR/ANVESHA AYUSHI.jpeg"
import bhavyapriya from "../assets/Teams/PR/BHAVYA PRIYA.jpg"
import harsh from "../assets/Teams/PR/HARSH DUBEY.png"
import kausik from "../assets/Teams/PR/KAUSIK PATRA.jpeg"
import krish from "../assets/Teams/PR/YADAV SHIVSHANKAR.jpg";


import ashutosh from "../assets/Teams/Event/ASHUTOSH PARMAR.jpg"
import aarshi from "../assets/Teams/Event/AARSHI KESAR.jpg"
import madhav from "../assets/Teams/Event/MADHAV GOYAL.png"
import pinki from "../assets/Teams/Event/PINKI PINKI.jpg"
import prachi from "../assets/Teams/Event/PRACHI PRIYA.jpeg"
import sayan from "../assets/Teams/Event/SAYAN SHIT.jpg"
import vedanshi from "../assets/Teams/Event/VEDANSHI ARYAN.png"
import sinha from "../assets/Teams/Event/ASHISH SINHA.jpg"

// Dummy data for all four teams – replace with real data later
const techTeamMembers = [
  {
    name: "Anmol Kumar",
    image: anmol_img1,
    role: "Tech Head",
    linkedinUrl: "https://www.linkedin.com/in/anmol-kumar-1ba37b324/",
  },
  {
    name: "Anmol Kumar",
    image: anmol_img2,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/anmol-kumar-0ab054323/",
  },
  {
    name: "Anshu Priya",
    image: anshu,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/anshu-priya-173311333",
  },
  {
    name: "Vidisha Bharati",
    image: vidisha,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/vidisha-bharati-03327b362",
  },
  {
    name: "Renvat Ram",
    image: renvat,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/renvat-c-a58bb537b",
  },
  {
    name: "Pratham Raj Sharma",
    image: pratham,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/pratham-raj-sharma-733876380",
  },
  {
    name: "Navya Barnwal",
    image: navya,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/navya-barnwal-6b5b39335",
  },
  
];

const prTeamMembers = [
  
  {
    name: "Anvesha Ayushi",
    image: anvesha,
    role: "PR Head",
    linkedinUrl: "https://www.linkedin.com/in/anvesha-ayushi",
  },
   {
    name: "Kausik Vaibhav Patra",
    image: kausik,
    role: "PR Head",
    linkedinUrl: "https://www.linkedin.com/in/kausik-vaibhav-patra-b999071b3/",
  },
  {
    name: "A S Bhavya Priya",
    image: bhavyapriya,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/a-s-bhavya-priya-487879341",
  },
  {
    name: "Anupriya Singh",
    image: anupriya,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/anupriya-singh-3b3a32380",
  },
  {
    name: "Harsh Dubey",
    image: harsh,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/hxrshthetic",
  },
  {
    name: "Akshat Keshri",
    image: akshat,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/akshat-keshri-018196274",
  },
  {
    name: "Krish yadav",
    image: krish,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/krish-yadav-203104381/",
  },
];

const emTeamMembers = [
  {
    name: "Madhav Raj Goyal",
    image: madhav,
    role: "Event Head",
    linkedinUrl: "https://www.linkedin.com/in/madhav-raj-goyal-98b225326",
  },
  {
    name: "Prachi Priya",
    image: prachi,
    role: "Event Head",
    linkedinUrl: "https://www.linkedin.com/in/prachi-priya-b46156326",
  },
  {
    name: "Ashish Sinha",
    image: sinha,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/ashish-sinha-283667328",
  },
  {
    name: "Ashutosh parmar",
    image: ashutosh,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/ashutosh-parmar-66ab11311/",
  },
  {
    name: "Sayan Shit",
    image: sayan,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/sayan-shit-35836b3aa/",
  },
  
  {
    name: "VEDANSHI ARYAN",
    image: vedanshi,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/vedanshi-aryan-0b0545318/",
  },
  {
    name: "Aarshi Raj Kesar",
    image: aarshi,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/aarshi-raj-kesar-543922376/",
  },
  {
    name: "Pinki",
    image: pinki,
    role: "Member",
    linkedinUrl: "https://www.linkedin.com/in/pinki-p-53451b38b",
  },
  
];

const iprTeamMembers = [
  {
    name: "Sarthak Jain",
    image: "https://picsum.photos/seed/sarthak/300/300",
    role: "IPR Lead",
    linkedinUrl: "https://www.linkedin.com",
  },
  {
    name: "Tanya Roy",
    image: "https://picsum.photos/seed/tanya/300/300",
    role: "Research Analyst",
    linkedinUrl: "https://www.linkedin.com",
  },
  {
    name: "Mohit Yadav",
    image: "https://picsum.photos/seed/mohit/300/300",
    role: "Policy Coordinator",
    linkedinUrl: "https://www.linkedin.com",
  },
  {
    name: "Khushi Mehta",
    image: "https://picsum.photos/seed/khushi/300/300",
    role: "Documentation Lead",
    linkedinUrl: "https://www.linkedin.com",
  },
];



export default function TeamPage() {
  return (
    <div className="team-page">
      <TeamPageHeader />

      <main className="team-page-main">
        <EachTeam
          teamTitle="Tech Team"
          teamTagline="Builders and problem solvers driving technical excellence."
          members={techTeamMembers}
        />

        <EachTeam
          teamTitle="Marketing and PR Team"
          teamTagline="Storytellers shaping our brand and connecting us with the community."
          members={prTeamMembers}
        />

        <EachTeam
          teamTitle="Event Management Team"
          teamTagline="Planners ensuring every initiative is executed seamlessly."
          members={emTeamMembers}
        />

      </main>
    </div>
  );
}



// const techTeamMembers = [
//   {
//     name: "Anmol Kumar",
//     image: "https://drive.google.com/file/d/1pE9gfPM1-DmELeR6dJh1WEOFPuiORsAy/view?usp=sharing",
//     role: "Tech Head",
//     linkedinUrl: "https://www.linkedin.com/in/anmol-kumar-1ba37b324/",
//   },
//   {
//     name: "Vidisha Bharati",
//     image: "https://drive.google.com/file/d/1lkI5lVR0UDa-hI35lzcm7TpJTkM6VgQw/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/vidisha-bharati-03327b362",
//   },
//   {
//     name: "Renvat Ram",
//     image: "https://drive.google.com/file/d/1jYC9RWbDT2-OcoE-JJRgAfdeFLCMgqtL/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/renvat-c-a58bb537b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
//   },
//   {
//     name: "Pratham Raj Sharma",
//     image: "https://drive.google.com/file/d/1Kkx2fk0cs_GR5f5me0gsF-xqhI8a785I/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/pratham-raj-sharma-733876380?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
//   },
//   {
//     name: "Navya Barnwal",
//     image: "https://drive.google.com/file/d/1daOK3ulQbleWaw02J7npeFRYYSIAyhm-/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/navya-barnwal-6b5b39335",
//   },
//   {
//     name: "Anshu Priya",
//     image: "https://drive.google.com/file/d/1PzygonKhk4vT_VWZa3e6NHZxa_n5lcIl/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/anshu-priya-173311333",
//   },
// ];

// const prTeamMembers = [
//   {
//     name: "Anvesha Ayushi",
//     image: "https://drive.google.com/file/d/1OsJtZCuTX7QK5e9-cSnP2OFb0WIdFeMr/view?usp=sharing",
//     role: "PR Head",
//     linkedinUrl: "https://www.linkedin.com/in/anvesha-ayushi",
//   },
//   {
//     name: "A S Bhavya Priya",
//     image: "https://drive.google.com/file/d/1Kn-ueTykCegmJ_7bOB3LluYpFiEF9vJf/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/a-s-bhavya-priya-487879341?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//   },
//   {
//     name: "Anupriya Singh",
//     image: "https://drive.google.com/file/d/1eFQQOG0ltgzRhKYNPiHy9S-WNanCXhR_/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/anupriya-singh-3b3a32380?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//   },
//   {
//     name: "Harsh Dubey",
//     image: "https://drive.google.com/file/d/1ZkoNhzuqH5FvNjpODt11fj1HtlUP2yHj/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/hxrshthetic",
//   },
//   {
//     name: "Akshat Keshri",
//     image: "https://drive.google.com/file/d/1ozZZTYEqp1gpq0ltuRD0pJDSfOjg6U99/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/akshat-keshri-018196274?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//   },
// ];

// const emTeamMembers = [
//   {
//     name: "Madhav Raj Goyal",
//     image: "https://drive.google.com/file/d/1J4c-QrXomOsGO8qtLEBzI1yn6BqEGNet/view?usp=sharing",
//     role: "Event Head",
//     linkedinUrl: "https://www.linkedin.com/in/madhav-raj-goyal-98b225326",
//   },
//   {
//     name: "Prachi Priya",
//     image: "https://drive.google.com/file/d/1Q5VzM6XEhtEcrxPQ2ShHgMjIqCpRlXYc/view?usp=sharing",
//     role: "Event Head",
//     linkedinUrl: "https://www.linkedin.com/in/prachi-priya-b46156326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
//   },
//   {
//     name: "Pinki",
//     image: "https://drive.google.com/file/d/1gjQfmiD6rKRLdPJtTtvrdqFmOYnruNg5/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/pinki-p-53451b38b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//   },
//   {
//     name: "Sayan Shit",
//     image: "https://drive.google.com/file/d/1IKZ3KVW0I4ZeD0zS4jNMjR5BN2nlWXBQ/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/sayan-shit-35836b3aa/",
//   },
//   {
//     name: "Ashish Sinha",
//     image: "https://drive.google.com/file/d/1s0jpaUjY8YEV7VbIKaF6bdNVxC862P7y/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/ashish-sinha-283667328?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
//   },
//   {
//     name: "VEDANSHI ARYAN",
//     image: "https://drive.google.com/file/d/1TQLYKPx7i-2IeWZl8v-JUFYIWnaY4nuI/view?usp=sharing",
//     role: "Member",
//     linkedinUrl: "https://www.linkedin.com/in/vedanshi-aryan-0b0545318/",
//   },
// ];

// const iprTeamMembers = [
//   {
//     name: "Sarthak Jain",
//     image: "https://picsum.photos/seed/sarthak/300/300",
//     role: "IPR Lead",
//     linkedinUrl: "https://www.linkedin.com",
//   },
//   {
//     name: "Tanya Roy",
//     image: "https://picsum.photos/seed/tanya/300/300",
//     role: "Research Analyst",
//     linkedinUrl: "https://www.linkedin.com",
//   },
//   {
//     name: "Mohit Yadav",
//     image: "https://picsum.photos/seed/mohit/300/300",
//     role: "Policy Coordinator",
//     linkedinUrl: "https://www.linkedin.com",
//   },
//   {
//     name: "Khushi Mehta",
//     image: "https://picsum.photos/seed/khushi/300/300",
//     role: "Documentation Lead",
//     linkedinUrl: "https://www.linkedin.com",
//   },
// ];
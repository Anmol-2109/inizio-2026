

// import TeamMemberCard from "./TeamCard";
// import "./EachTeam.css";

// /**
//  * Reusable team section component.
//  *
//  * Props:
//  * - teamTitle: main heading (e.g. "Tech Team")
//  * - teamTagline: one-line description under the title
//  * - members: Array<{
//  *     name: string;
//  *     image: string;
//  *     role: string;
//  *     linkedinUrl?: string;
//  *   }>
//  */
// export default function EachTeam({ teamTitle, teamTagline, members }) {
//   return (
//     <section className="team-section">
//       <div className="team-header">
//         <h2 className="team-title">{teamTitle}</h2>
//         {teamTagline && <p className="team-description">{teamTagline}</p>}
//       </div>

//       <div className="team-layout">
//         <div className="team-members-grid">
//           {members.map((member) => (
//             <TeamMemberCard
//               key={member.name}
//               name={member.name}
//               image={member.image}
//               role={member.role}
//               linkedinUrl={member.linkedinUrl}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


import TeamMemberCard from "./TeamCard";
import "./EachTeam.css";

/**
 * Reusable team section component.
 *
 * Props:
 * - teamTitle: main heading (e.g. "Tech Team")
 * - teamTagline: one-line description under the title
 * - members: Array<{
 *     name: string;
 *     image: string;
 *     role: string;
 *     linkedinUrl?: string;
 *   }>
 */
export default function EachTeam({ teamTitle, teamTagline, members }) {
  return (
    <section className="team-section1">
      <div className="team-header1">
        <h2 className="team-title1">{teamTitle}</h2>
        {teamTagline && <p className="team-description1">{teamTagline}</p>}
      </div>

      <div className="team-layout1">
        <div className="team-members-grid1">
          {members.map((member, index) => (
            <TeamMemberCard
              key={member.name + index}
              name={member.name}
              image={member.image}
              role={member.role}
              linkedinUrl={member.linkedinUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
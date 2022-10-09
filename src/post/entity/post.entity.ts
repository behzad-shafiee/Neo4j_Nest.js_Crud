// import { Field, Model } from 'neo4j-node-ogm';
// import { Comment } from './comment.entity';

// export class Post extends Model {
//   constructor(values) {
//     const labels = ['POST'];
//     const attributes = {
//       tjttle: Field.String({
//         require:true
//       }),
//       comment: Field.Relationship({
//         labels: ['HAS_A'],
//         target: Comment
//       }),
//     };
//     super(values, labels, attributes);
//   }
// }

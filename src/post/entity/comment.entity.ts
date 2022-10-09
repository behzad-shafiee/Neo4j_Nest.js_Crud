// import { Field, Model } from 'neo4j-node-ogm';
// import { Post } from './post.entity';

// export class Comment extends Model {
//   constructor(values) {
//     const labels = ['COMMENT'];
//     const attributes = {
//       name: Field.String({
//         require:true
//       }),
//       post: Field.Relationship({
//         labels: ['OF'],
//         target: Post
//       }),
//     };
//     super(values, labels, attributes);
//   }
// }

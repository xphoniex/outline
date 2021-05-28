// @flow
import { Share } from "../models";
import { presentUser } from ".";

export default function present(share: Share, isAdmin: boolean = false) {
  let data = {
    id: share.id,
    documentId: share.documentId,
    documentTitle: share.document.title,
    documentUrl: share.document.url,
    published: share.published,
    url: `${share.team.url}/share/${share.id}`,
    createdBy: presentUser(share.user),
    lastAccessedAt: share.lastAccessedAt,
    createdAt: share.createdAt,
    updatedAt: share.updatedAt,
    table: presentShareTable(share),
  };

  if (!isAdmin) {
    delete data.lastAccessedAt;
  }

  return data;
}

function presentShareTable(share: Share) {
  let sharedIds = {};
  share.collection = share.collection || { shares: [], documentStructure: [] };
  share.collection.shares.map(s => { if (s.published) { sharedIds[s.documentId] = s.id } });

  let table = [];

  let traverse = (root, level) => {
    let addedAny = false;

    for (let child of root) {  
      if (child.id in sharedIds) {
        table.push({
          title: child.title,
          level,
          url: sharedIds[child.id],
        });
        addedAny = true;
      }
  
      if (child.children.length > 0) {
        let newLevel = addedAny ? level + 1 : level;
        traverse(child.children, newLevel);
      }
    }
  }

  traverse(share.collection.documentStructure, 1);

  return table;
}
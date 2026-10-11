export type MessageBlock =
  | { kind:'paragraph'|'heading'|'code'; text:string }
  | { kind:'ordered'|'unordered'; items:string[]; start:number };

// Deliberately supports text formatting only: no HTML, images or model-generated links.
export function messageBlocks(text:string):MessageBlock[] {
  const blocks:MessageBlock[]=[];
  const lines=text.replace(/\r\n/g,'\n').split('\n');
  let paragraph:string[]=[];
  const flush=()=>{if(paragraph.length){blocks.push({kind:'paragraph',text:paragraph.join('\n')});paragraph=[];}};
  for(let i=0;i<lines.length;i++){
    const line=lines[i];
    if(/^\s*```/.test(line)){
      flush();const code:string[]=[];
      while(++i<lines.length&&!/^\s*```/.test(lines[i]))code.push(lines[i]);
      blocks.push({kind:'code',text:code.join('\n')});continue;
    }
    if(!line.trim()){flush();continue;}
    const heading=line.match(/^#{1,6}\s+(.+)$/);
    if(heading){flush();blocks.push({kind:'heading',text:heading[1]});continue;}
    const item=line.match(/^\s*(?:(\d+)[.)]|[-*+])\s+(.+)$/);
    if(item){
      flush();const kind=item[1]?'ordered':'unordered';const previous=blocks.at(-1);
      if(previous?.kind===kind)previous.items.push(item[2]);
      else blocks.push({kind,items:[item[2]],start:item[1]?Number(item[1]):1});
    }else paragraph.push(line);
  }
  flush();return blocks;
}

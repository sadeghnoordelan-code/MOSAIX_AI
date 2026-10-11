import { messageBlocks } from './message-content';
function InlineText({text}:{text:string}) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part,index)=>
    part.startsWith('**')?<strong key={index}>{part.slice(2,-2)}</strong>:
    part.startsWith('`')?<code key={index}>{part.slice(1,-1)}</code>:part);
}
export function MessageText({text}:{text:string}) {
  return <div className="ai-prose" dir="auto">{messageBlocks(text).map((block,index)=>{
    if(block.kind==='code')return <pre key={index}><code>{block.text}</code></pre>;
    if(block.kind==='heading')return <p className="ai-prose-heading" key={index}><InlineText text={block.text}/></p>;
    if(block.kind==='ordered'||block.kind==='unordered'){
      const items=block.items.map((item,i)=><li key={i}><InlineText text={item}/></li>);
      return block.kind==='ordered'?<ol key={index} start={block.start}>{items}</ol>:<ul key={index}>{items}</ul>;
    }
    if(block.kind === 'paragraph')return <p key={index}><InlineText text={block.text}/></p>;
    return null;
  })}</div>;
}

import type {ReactNode} from 'react';

/** Keep the brand lettering distinct without changing the text, links or accessible names. */
export function BrandText({children}:{children:string}):ReactNode{
 if(!/mosaix/i.test(children))return children;
 return <>{children.split(/(mosaix)/gi).map((part,index)=>/^mosaix$/i.test(part)?<bdi className="mosaix-word" key={index}>{part}</bdi>:part)}</>;
}

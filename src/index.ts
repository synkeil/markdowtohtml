// interfaces
interface inlineFormat {
  txt:string,
  char:string,
  replStart:string,
  rplEnd:string,
  index:number,
  wrapper:HTMLElement[]
}
//function declarations
const makeEl = (element:string | null,tag:string,...children:HTMLElement[]):HTMLElement => {
  if (tag === "hr") {
    const el:HTMLElement = document.createElement(tag);
    el.style.cssText = "width:100%";
    return el;
  }
  const el:HTMLElement = document.createElement(tag);
  const txt:Text = document.createTextNode(element || "");
  el.appendChild(txt);
  if (children) {
    children.map(x => el.innerHTML += x);
  }
  return el;
}

const isOdd = (num:number) => { return num % 2}

const inlineFormat = ({txt,char,replStart,rplEnd,index,wrapper}:inlineFormat) => {
  const format = txt.split(char);
  format.map((x,i)=>{
    if (isOdd(i) > 0) {
      format[i] = `${replStart}${x}${rplEnd}`
    }
  });
  wrapper[index].innerHTML = format.join(" ");
  return format.join(" ");
}

const parseMd = (string:string) => {
  //  declaring variables
  const el = string;
  const lines:string[] = [];
  const formattedFull:HTMLElement[] = [];
  let isList = false;
  let listIndex:number = 0;
  // extract explicit line breaks
  el.split('\n').map(x=>lines.push(x));
  // check for headers
  lines.map((x,i) => {
    switch (x.slice(0,(x.indexOf(' ') + 1))) {
      case ">\ ":
      case "-\ ":
        if (isList) {
          const listItem = "<li>"+x.slice(2,x.length)+"</li>";
          formattedFull[listIndex].append(listItem);
        }
        else {
          isList = true;
          listIndex = i;
          const listItem = "<li>"+x.slice(2,x.length)+"</li>";
          const newList = makeEl(listItem,'ul');
          formattedFull.push(newList);
        }
        break;
      case "0. ":
      case "1. ":
      case "2. ":
      case "3. ":
      case "4. ":
      case "5. ":
      case "6. ":
      case "7. ":
      case "8. ":
      case "9. ":
        if (isList) {
          const listItem = "<li>"+x.slice(2,x.length)+"</li>";
          formattedFull[listIndex -1].append(listItem);
        }
        else {
          isList = true;
          listIndex = i;
          const listItem = "<li>"+x.slice(2,x.length)+"</li>";
          const newList = makeEl(listItem,'ol');
          formattedFull.push(newList);
        }
        break;
      case "___\ ": formattedFull.push(makeEl(x.replace('___\ ', ""),'hr'));
      case "#\ ": formattedFull.push(makeEl(x.replace('#\ ', ""),'h1'));
      break;
      case "##\ ": formattedFull.push(makeEl(x.replace('##\ ', ""),'h2'));
        break;
      case "###\ ": formattedFull.push(makeEl(x.replace('###\ ', ""),'h3'));
        break;
      case "####\ ": formattedFull.push(makeEl(x.replace('####\ ', ""),'h4'));
        break;
      case "#####\ ": formattedFull.push(makeEl(x.replace('#####\ ', ""),'h5'));
        break;
      case "######\ ": formattedFull.push(makeEl(x.replace('######\ ', ""),'h6'));
        break;
      default: isList = false;formattedFull.push(makeEl(x,'p'))
        break;
    }
  });

  formattedFull.map((x,i) => {
    // target and format italic
    let str:string | null = x.textContent || "";
    str = inlineFormat ({
      txt:str,
      char:"~~",
      replStart:"<i>",
      rplEnd:"</i>",
      index:i,
      wrapper:formattedFull
    })
    // target and format bold
    str = inlineFormat ({
      txt:str,
      char:"**",
      replStart:"<strong>",
      rplEnd:"</strong>",
      index:i,
      wrapper:formattedFull
    })
    // target and format underline
    str = inlineFormat ({
      txt:str,
      char:"__",
      replStart:"<u>",
      rplEnd:"</u>",
      index:i,
      wrapper:formattedFull
    })
  })
  
  return formattedFull;
}

const testTexty = `
# Linux ~~commands~~

## __Os bootable ~~install~~ usb__
**__sudo__ dd** if=manjaro-openbox-18.0.2-2018520-stable-x86_64.iso of=/dev/rdisk3 bs=1m
## Erase a __disk__ from console
diskutil **eraseDisk** JHFS+ Emptied /**dev**/disk6s2
##### Os bootable install usb
sudo dd if=__manjaro-openbox__-18.0.2-2018520-stable-x86_64.iso of=/dev/rdisk3 bs=1m
sudo dd if=__manjaro-openbox__-18.0.2-2018520-stable-x86_64.iso of=/dev/rdisk3 bs=1m
**sudo dd if=__manjaro-openbox__-18.0.2-2018520-stable-x86_64.iso of=/dev/rdisk3 bs=1m**
___ 
~~sudo dd if=__manjaro-openbox__-18.0.2-2018520-stable-x86_64.iso of=/dev/rdisk3 bs=1m~~
###### Erase a ~~disk~~ from console
diskutil eraseDisk ~~JHFS+~~ Emptied /dev/disk6s2
> test list
> list 2
. third test
- fourth test
not a list anymore
1. new ordered list element
1. fuck
2. yeah
`;

const parsedText = parseMd(testTexty);

parsedText.map(x => document.body.append(x))

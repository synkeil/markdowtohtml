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
  let isoList = false;
  let isuList = false;
  let olistIndex = 0;
  let ulistIndex = 0;
  // extract explicit line breaks
  el.split('\n').map(x=>lines.push(x));
  // check for headers
  lines.map(x => {
    switch (x.slice(0,(x.indexOf(' ') + 1))) {
      // unordered list
      case ">\ ":
      case "-\ ":
        if (isuList) {
          const listItem = "<li>"+x.slice(2,x.length)+"</li>";
          formattedFull[ulistIndex].append(listItem);
        }
        else {
          isuList = true;
          const listItem = "<li>"+x.slice(2,x.length)+"</li>";
          const newList = makeEl(listItem,'ul');
          formattedFull.push(newList);
          ulistIndex = formattedFull.length - 1;
        }
        break;
      // oredered list
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
        if (isoList) {
          const listItem = "<li>"+x.slice(2,x.length)+"</li>";
          formattedFull[olistIndex].append(listItem);
        }
        else {
          isoList = true;
          const listItem = "<li>"+x.slice(2,x.length)+"</li>";
          const newList = makeEl(listItem,'ol');
          formattedFull.push(newList);
          olistIndex = formattedFull.length - 1;
        }
        break;
      case "---\ ": formattedFull.push(makeEl(x.replace('---\ ', ""),'hr'));
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
      // case "\n\n ": formattedFull.push(makeEl(x.replace('\n\n ', ""),'p'));
        // break;
      default: 
        isuList = false;
        isoList = false;
        formattedFull.push(makeEl(x,'p'))
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
> third test
- fourth test


not a list anymore
1. new ordered list element
1. fuck
2. yeah
`;


const printParsed = (input:HTMLTextAreaElement | null,output:HTMLElement)=>{
  // Ref input and output elements
  const elIn = input;
  const elOut =  output;
;  // Listen for inputs
  if (elIn !== null && elIn.nodeName === "TEXTAREA") {
    elIn.addEventListener("keyup",()=>{
      // Resetting output
      elOut.innerHTML = "";
      // Format input to md
      const parsedText = parseMd(elIn.value || '');
      // Print formatted text to output
      parsedText.map(x => {
        elOut.append(x || "");
      })
    });
  }
}

const elementIn:any = document.getElementById('input');
const elementOut = document.getElementById("output") || document.body;

printParsed(elementIn,elementOut)

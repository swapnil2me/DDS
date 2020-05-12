let subtract = document.querySelector("#subtract");
let extract = document.querySelector("#extract");
let fit = document.querySelector("#fit");

subtract.addEventListener('click',function subtract() {
  console.log('subtract');
  d3.tsv("phase.tsv",(error,phase) => {
    // phase.forEach((item, i) => {
    //   console.log(Object.keys(item));
    // });
    let vgDC = Object.keys(phase[0]);
    let data = vgDC.map((i) => {
                          let s = [];
                          let s0 = {};
                          phase.forEach((item, j) => {
                            s.push(item[i]);
                          });
                          // console.log(i);
                          return s0[i]=s;
                        })
    let zeroIndex = vgDC.findIndex((i)=>i==0)
    console.log(zeroIndex);
  })
},false);

extract.addEventListener('click',function subtract() {
  console.log('extract');
},false);

fit.addEventListener('click',function subtract() {
  console.log('fit');
},false);

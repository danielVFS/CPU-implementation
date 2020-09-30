var memoria = [];
var pc = 0;
var mbr;
var mar;
var ir;
var ro0;
var ro1;
var imm;

var e;
var l;
var g;

// mascaras
var mascReg0 = 0xE00000;
var mascReg1 = 0x1C0000;  
var mascAdress = 0x1FFFFF;

// conversões OK - Testadas com sucesso
// função para converter o valor do textarea
function converter() {
  var instructionCode = document.getElementById("textAreaOriginal").value;
  var instructions = instructionCode.toLowerCase().split("\n");
  var acumulator = "";
  var instructionWord = "";
  var memoryAddress = "";
  var reg0;
  var reg1;
  var imm;

  for (const instruction of instructions) {
    if(instruction != null) {
      var aux = instruction.split(" ");
      var opcode = aux[0];

      opcode = opcodeToHexa.get(aux[0]) ? opcodeToHexa.get(aux[0]) : null; // No método Map, é possivel utilizar o .get para pegar valores no array

      opcode = opcode << 24; // deslocando 24 bits;

      // no caso de ser o hlt
      if(aux[1] == null) {
        instructionWord = 0; // fazendo isso devido a alguns bugs no map
        //console.log(instructionWord);
      } 
      else if(aux[2] == null) { // em casos onde se tem apenas o opcode e a instrução
        memoryAddress = parseInt(aux[1], 16); // passando para hexa
        memoryAddress = memoryAddress & mascAdress;

        instructionWord = (opcode | memoryAddress); // formando a instrução
      } 
      else {
        // em caso de ser ld ou st, onde se tem um registrador
        if(opcode == 0x01 << 24 || opcode == 0x02 << 24) {
          reg0 = aux[1].slice(0,2); // eliminando a virgula
          reg0 = regToDec.get(reg0);
          reg0 = reg0 << 21; // deslocando para pegar o valor do reg
          reg0 = reg0 & mascReg0;

          memoryAddress = parseInt(aux[2], 16); // passando para hexa
          memoryAddress = memoryAddress & mascAdress;

          //console.log(`${opcode} + ${reg0} + ${memoryAddress}`);

          instructionWord = (opcode | reg0 | memoryAddress);
          //console.log(instructionWord);
        }
        // em casos de add, sub, mul, div, cmp
        else if(opcode > 0x02 << 24 && opcode < 0x07 << 24|| opcode == 0x09 << 24 || opcode == 0x17 << 24){
          reg0 = aux[1].slice(0,2); // eliminando a virgula
          reg1 = aux[2].slice(0,2); // eliminando a virgula
          reg0 = regToDec.get(reg0);
          reg1 = regToDec.get(reg1);

          reg0 = reg0 + mascReg0;
          reg1 = reg1 + mascReg1;
      
          // deslocando
          reg0 = reg0 << 21;
          reg1 = reg1 << 18;
          
          //console.log(`${opcode} + ${reg0} + ${reg1}`);

          instructionWord = (opcode | reg0 | reg1);
          //console.log(instructionWord);
        }
        // em casos de lsh, rsh, movih, movil, addi, subi, muli, divi, movrr
        else {
          reg0 = aux[1].slice(0, 2); //eliminando a virgula
          reg0 = regToDec.get(reg0);
          reg0 = reg0 + mascReg0;
          reg0 = reg0 << 21;

          imm = parseInt(aux[2], 16); // deve ser passado para o hexa ???????????
          imm = imm & mascAdress; // utilizando a mesma mascara do endereço de memória

          instructionWord = (opcode + reg0 + imm);
        }
      }

      // convertendo para string apenas para mostrar na tela
      var visualInstruction = instructionWord;
      visualInstruction = preencherBits(instructionWord.toString(16).toUpperCase(), 8);
      
      // apenas para mostrar no text area
      acumulator = acumulator + visualInstruction + "\n";

    }
  }

  document.getElementById('textAreaConvertido').value = acumulator;
}

// Funçaõ responsável por colocar os valores convertidos para a memória
function submeter() {
  var instruction = document.getElementById('textAreaConvertido').value;
  var instructions = instruction.split("\n");

  // contador auxiliar para gravar na memória
  var contador = 0;

  instructions.forEach((instruction) => {
    if(instruction != "") {
      var input = document.getElementById(`${contador}`);
     
      input.value = instruction;
      memoria[contador] = parseInt(instruction, 16);
      contador++;   
    }   
  });
}

// funçaõ para preencher com 0s onde está incompleto
function preencherBits(param, bits) {
  while(param.length < bits) {
    param = 0 + param;
  }

  return param;
}

// ao clicar no input, adiciona o valores do input convertido em hexadecimal
// mostra o valor na tela e adiciona na memoria
function changeMenu() {
  var input = event.target;
  var visualValue; 
  var virtualValue;

  // em caso de usuário não preencher algum valor;
  if(!input.value) {
    visualValue = "0";
    virtualValue = 0;
  } 
  else {
    visualValue = input.value.toUpperCase();
    virtualValue = parseInt(visualValue, 16);
  }
  
  //console.log(`${visualValue} - ${virtualValue}`);
  
  visualValue = preencherBits(visualValue, 8);

  input.value = visualValue;
  memoria[input.id] = virtualValue;
}


/*
  função para executar o ciclo da maquina
  Passo a Passo:
    1. ler a memória
*/
function nextInstruction() {
  /* lendo a memória; */
  
  // pegando o opcode
  ir = memoria[pc];
  ir = ir & 0x0F000000; // mascara para pegar o opcode
  ir = ir >> 24;

  // pegando o mar
  mar = memoria[pc] & 0x1FFFFF;

  // pegando o mbr
  mbr = memoria[mar];

  // incrementando o contador pc
  pc++;

  atualizarProcessador(ir, mar, mbr, pc);
}

// atualizando o processador a cada ciclo
function atualizarProcessador(ir, mar, mbr,pc) {
  document.getElementById("ir").value = preencherBits(ir.toString(16).toUpperCase(), 2);
  document.getElementById("mar").value = preencherBits(mar.toString(16).toUpperCase(), 8);
  document.getElementById("mbr").value = preencherBits(mbr.toString(16).toUpperCase(), 8);
  document.getElementById("pc").value = preencherBits(pc.toString(16).toUpperCase(), 6);
}

// Map de opcodes convertidos para hexa
var opcodeToHexa = new Map([
  ["hlt", 0x00],
  ["ld", 0x01],
  ["st", 0x02],
  ["add", 0x03],
  ["sub", 0x04],
  ["mul", 0x05],
  ["div", 0x06],
  ["lsh", 0x07],
  ["rsh", 0x08],
  ["cmp", 0x09],
  ["je", 0x0A],
  ["jne", 0x0B],
  ["jl", 0x0C],
  ["jle", 0x0D],
  ["jg", 0x0E],
  ["jge", 0x0F],
  ["jmp", 0x10],
  ["movih", 0x11],
  ["movil", 0x12],
  ["addi", 0x13],
  ["subi", 0x14],
  ["muli", 0x15],
  ["divi", 0x16],
  ["movrr", 0x17],
]);

// Map de registradores retornando o codigo binario
var regToDec = new Map([
  ["r0", 0],
  ["r1", 1],
  ["r2", 2],
  ["r3", 3],
  ["r4", 4],
  ["r5", 5],
  ["r6", 6],
  ["r7", 7],
]);


/* Importações relacionadas ao uso dos pinos de GPIO
 * no DeviceScript. A função delay() permite aguardar por um
 * período de tempo. */
import { IOPin, GPIOMode } from "@devicescript/core"
import { pinMode } from "@devicescript/gpio"
// import { factor_bits } from "./helper"

// Neste exemplo, será usada a placa ESP32 DevKitC.
import { pins } from "@dsboard/esp32_devkit_c"

/* Em nosso exemplo, serão 3 bits (3 LEDs). Sendo assim, o limite superior do
 * contador é 2^3 = 8. Não é a mesma coisa que o maior valor representado 2^3 - 1. */
const MAX_BITS = 3;
const MAX_VALUE = Math.pow(2, MAX_BITS);

/* pin_led é um vetor que conterá os pinos a serem usados em nossa aplicação.
 * Usar vetor assim não é obrigatório, aqui foi somente para organização. */
let pin_led: IOPin[] = [];

// Usaremos os pinos 13, 14 e 26.
pin_led.push(pins.P13);
pin_led.push(pins.P14);
pin_led.push(pins.P26);

/* Cada pino será usado apenas para saída, já que apenas enviaremos sinais
 *  para ligar ou desligar o LED conectado. */
for (let i = 0; i < pin_led.length; i++) {
   pin_led[i].setMode(GPIOMode.Output);
}

/* Função para converter um número inteiro em sua
 * representação binária. Dado o número num e a quantidade
 * de bits num_bits desejada, será retornado um vetor de 
 * 0s e 1s. Como JS/TS trabalha com tipo number, o retorno
 * será um vetor de number's. Observe que, devido à fatoração,
 * o vetor deve ser populado da direita para esquerda para
 * refletir a ordem dos bits nos LEDs posteriormente. */
function factor_bits(num: number, num_bits: number): number[] {
   let reminder: number = num;
   let led_bits: number[] = new Array<number>(num_bits);
   for (let i = num_bits - 1; i >= 0; i--) {
      //led_bits.push(reminder % 2);
      //console.log("AIIII")
      led_bits[i] = reminder % 2;
      reminder = Math.floor(reminder / 2);
   }
   return led_bits;
}

// count: valor atual do contador 
let count = 0;
// times: quantas vezes o contador foi incrementado 
let times = 0; 

/* A cada 1000ms, será executada a arrow function definida dentro 
 * do setInterval. Ela converterá o contador para binário e 
 * escreverá o valor de cada bit para o pino correspondente. 
 * Uma mensagem de depuração será apresentada no log. 
 * O contador será incrementado ao final, e se chegar ao valor máximo, 
 * voltará a 0. */
const interval: number = setInterval(() => {
   // Determinação da representação binária do valor atual do contador
   let led_bits = factor_bits(count, MAX_BITS);
   /* Escrita do valor de cada bit da representação binária no
    * respectivo pino. O valor do bit resultará em um LED aceso (1) ou
    * apagado (0). A posição do pino é a mesma do bit na fatoração. */
   for (let i = 0; i < MAX_BITS; i++) {
      pin_led[i].write(led_bits[i]);
   }
   // Mensagem impressa no console para depuração
   console.log(`v2 - ${times} - Count ${count} -> P13: ${led_bits[0]} - P14: ${led_bits[1]} - P26: ${led_bits[2]}`)
   //console.data({times, count})
   //console.data({ times })
   /* Incremento no contador - se o valor dele chegar ao valor máximo após isso,
    * então deve ser resetado para 0. */
   count++;
   if (count >= MAX_VALUE) {
      count = 0;
   }
   times++;
}, 1000);


# Back-end
## Tipos de Datos
![image](https://user-images.githubusercontent.com/109872028/218519741-48b0a70d-ab71-47e4-a206-01d8e2443356.png)
<code>
const list1 = ['LKD001','LOT854','ASE963','POR478']
const list2 = []
// recibir un array
// verificar que no este vació o indicar por consola 
// mostrar uno a uno los elementos
// finaliza el proceso devolviendo la longitud de la lista
//
    // If the array is not empty, then print each element of the array and the length of the array.
// Otherwise, print that the array is empty.
// @param array - the array to be checked
//
function verifica (array){
if (array.length !== 0){
    for (let i=0; i<array.length; i++){
        console.log(array[i])
    }
    console.log(`tamaño del array es ${array.length}`)
} else console.log('El array esta vacío')
}
verifica(list1)
verifica(list2)
</code>

## CLASES
    ![image](https://user-images.githubusercontent.com/109872028/218539025-4ac17ac4-c234-4439-846c-d878c96a1439.png)
![image](https://user-images.githubusercontent.com/109872028/218540061-8cfc433a-d3ee-4828-8351-60fdd3512021.png)
![image](https://user-images.githubusercontent.com/109872028/218541176-2921dcaf-05a1-4d62-b2c9-5876ac3536cc.png)

<code>
        // Se declarará una clase Persona, la cual debe crearse con un nombre que identifique la instancia. 
// Además, habrá una variable estática utilizable para todos.
// Se comprobará la individualidad entre las dos instancias.
export class persona{
// The class persona has a constructor that takes two parameters, nombre and edad. It also has three
// methods, method1, method2, and method3. Method1 and method2 are regular methods, while method3 is a
// static method 
    constructor(nombre, edad){
        this.nombre = nombre;
        this.edad = edad;
    }
    static variableStatic = 18
    method1(){
        console.log('Soy el método 1')
    }
    method2=()=>{
        console.log('Soy el método 2')
    }
    method3(){
        if (this.edad >= persona.variableStatic){
            return console.log('Soy Mayor de edad')
        } else { 
            console.log(this.edad)
            console.log(persona.variableStatic)
             console.log('Soy menor de edad')}
    }
}
let instance1 = new persona();
instance1.method1();
instance1.method2();
let instance2 = new persona('Maria Eugenia',15);
instance1.nombre='Ronnie'
instance1.edad= 54
instance1.method3()
instance2.method3()
    </code>

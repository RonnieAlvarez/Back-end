# Back-end
## Tipos de Datos
![image](https://user-images.githubusercontent.com/109872028/218519741-48b0a70d-ab71-47e4-a206-01d8e2443356.png)

const list1 = ['LKD001','LOT854','ASE963','POR478']
const list2 = []

// recibir un array
// verificar que no este vació o indicar por consola 
// mostrar uno a uno los elementos
// finaliza el proceso devolviendo la longitud de la lista

/**
 * If the array is not empty, then print each element of the array and the length of the array.
 * Otherwise, print that the array is empty.
 * @param array - the array to be checked
 */
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

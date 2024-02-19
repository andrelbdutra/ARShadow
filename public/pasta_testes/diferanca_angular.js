// Função para calcular o produto escalar de dois vetores
function dotProduct(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

// Função para calcular a magnitude (norma) de um vetor
function magnitude(vector) {
    return Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2);
}

// Função para calcular as diferenças angulares entre pares correspondentes de vetores em graus
function angularDifferences(vetores1, vetores2) {
    // Verifica se as matrizes têm o mesmo comprimento
    if (vetores1.length !== vetores2.length) {
        throw new Error("As matrizes de vetores devem ter o mesmo comprimento.");
    }

    // Array para armazenar as diferenças angulares
    const differences = [];

    // Itera sobre os vetores e calcula as diferenças angulares
    for (let i = 0; i < vetores1.length; i++) {
        const v1 = vetores1[i];
        const v2 = vetores2[i];

        // Calcula o produto escalar dos vetores
        const dot = dotProduct(v1, v2);

        // Calcula as magnitudes dos vetores
        const magV1 = magnitude(v1);
        const magV2 = magnitude(v2);

        // Calcula o cosseno do ângulo entre os vetores usando o produto escalar
        const cosTheta = dot / (magV1 * magV2);

        // Calcula a diferença angular em radianos usando a inversa do cosseno
        const angleRad = Math.acos(cosTheta);

        // Converte o ângulo de radianos para graus
        const angleDeg = angleRad * (180 / Math.PI);

        // Adiciona a diferença angular ao array
        differences.push((i+1) + "° = " + angleDeg.toFixed(2));
    }

    return differences;
}

// Exemplo de uso
const vetores1 = [
    [-1.0458333793700685, 3.3456444787961086, -2.6094272598500092],
];

const vetores2 = [
    [-0.5, 4, -3],
];
//-1.33, 20.23, -12.08
const differences = angularDifferences(vetores1, vetores2);

console.log("Diferenças angulares entre vetores:");
console.log(differences);
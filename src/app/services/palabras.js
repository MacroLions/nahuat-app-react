import { collection, getDocs, getDoc, doc, setDoc } from "@firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

const setPalabraDB = async (palabra, significado, traduccion, imagen, audio, sinonimo, abrev, nahuat) => {
    try {
        const newDate = new Date();
        const storageRefImagen = ref(storage, `/imagenes/${newDate.getTime() + '-' + imagen.name}`);
        const storageRefAudio = ref(storage, `/audios/${newDate.getTime() + '-' + audio.name}`);
        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTaskImagen = uploadBytesResumable(storageRefImagen, imagen);
        const uploadTaskAudio = uploadBytesResumable(storageRefAudio, audio);

        await setDoc(doc(db, 'Palabras', traduccion), {
            palabra: palabra,
            traduccion: traduccion,
            significado: significado,
            imagen: newDate.getTime() + '-' + imagen.name,
            audio: newDate.getTime() + '-' + audio.name,
            sinonimo: sinonimo,
            abrev: abrev,
            nahuat: nahuat,
            estado: 'activo',
        })


    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

const getPalabras = async () => {
    let dataPalabras = []
    const palabras = await getDocs(collection(db, 'Palabras'));
    palabras.forEach((doc) => {
        dataPalabras.push(doc.data())
    });
    return dataPalabras
}


const getAudio = async (audio) => {
    try {
        return await getDownloadURL(ref(storage, `/audios/${audio}`)).then((url)=>url)
    }
    catch (e) {
        console.error("Error in get Audio: ", e);
    }
}

const getImagen = async (imagen) => {
    try {
        return await getDownloadURL(ref(storage, `/imagenes/${imagen}`)).then((url)=>url)
    }
    catch (e) {
        console.error("Error in get Image: ", e);
    }
}

export {
    setPalabraDB,
    getPalabras,
    getAudio,
    getImagen
}
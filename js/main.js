import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const page = ref("accueil")
const page_infos = ref(null)
const liste = ref([])
const recherche_musique = ref("")
const chanson_active = ref("")
const balise_audio = ref()
const en_lecture = ref(true)
const temps_actuel = ref(0)
const temps_total = ref(0)
const pourcentage_progression = ref(0)
const barre_volume = ref(0.5)

// Fetch la liste de chansons et ses informations
fetch('chansons/chansons.json').then(resp => {
    resp.json().then(contenu => {
        liste.value = contenu
    })
})

// Fonction pour changer la valeur de la page sans rafraîchir la page (principe SPA)
function changerPage(nouvelle_page) {
    page.value = nouvelle_page

    if (nouvelle_page == "accueil") {
        chanson_active.value = ""
    }
}

// Fonction pour convertir le temps en minutes et secondes en format 00:00
function convertir(temps) {
    let minutes = Math.floor(temps / 60)
    let secondes = Math.floor(temps % 60 ? temps % 60 : '00')

    if (minutes < 10) {
        minutes = "0" + minutes
    }

    if (secondes < 10) {
        secondes = "0" + secondes
    }

    return minutes + ":" + secondes
}

// Fonction pour filtrer les chansons selon une recherche
function filtrerMusique(chanson) {
    let recherche = recherche_musique.value.toLowerCase()

    let texte = chanson.titre
    texte += " " + chanson.artiste
    texte = texte.toLowerCase()

    // Si le texte recherché n'existe pas, on retourne false pour afficher 0 résultats de recherche
    if (texte.indexOf(recherche) == -1) {
        return false
    }

    return true
}

// Fonction qui active la chanson sélectionnée lors du click
function selectionnerChanson(chanson) {
    chanson_active.value = chanson
    en_lecture.value = true
}

// Fonction qui "toggle" la chanson en mode "play" versus "pause"
function toggleLectureChanson() {
    if (!balise_audio.value.paused) {
        balise_audio.value.pause()
    } else {
        balise_audio.value.play()
    }
}

// Fonction qui détermine la progression de la chanson avec le temps actuel et la durée totale de la chanson
// Si la chanson termine, la fonction appelle à une autre fonction pour jouer la prochaine chanson
function progressionChanson(chanson_id) {
    if (!balise_audio.value) {
        return
    }

    temps_actuel.value = balise_audio.value.currentTime
    temps_total.value = balise_audio.value.duration
    pourcentage_progression.value = Math.round(temps_actuel.value / temps_total.value * 100)

    if (balise_audio.value.ended) {
        jouerProchaineChanson(chanson_id)
    }
}

// Fonction qui fait jouer la prochaine chanson dans la liste et si la dernière chanson est jouée, elle arrête la lecture des chansons
function jouerProchaineChanson(id) {
    if (id < (liste.value.length - 1)) {
        id += 1
        chanson_active.value = liste.value[id]

    } else {
        chanson_active.value = ""
    }
}

// Fonction pour augmenter ou diminuer le volume de la chanson
function changerVolume() {
    balise_audio.value.volume = barre_volume.value
}

const root = {
    setup() {
        return {
            //Propriétés
            page,
            page_infos,
            liste,
            recherche_musique,
            chanson_active,
            balise_audio,
            en_lecture,
            temps_actuel,
            temps_total,
            pourcentage_progression,
            barre_volume,

            //Méthodes
            changerPage,
            convertir,
            filtrerMusique,
            selectionnerChanson,
            jouerProchaineChanson,
            toggleLectureChanson,
            progressionChanson,
            changerVolume,
        }
    }
}

//Initialisation de vue
createApp(root).mount('#app')
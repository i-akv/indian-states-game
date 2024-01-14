const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const correct_audio = new Audio('resources/success_audio.mp3'); 
const incorrect_audio = new Audio('resources/fail_audio.mp3'); 

// const img = document.getElementById("img");

// 700 x 835
canvas.width = 720;
canvas.height = 835;

const popup = document.getElementById("popup_container")

// ctx.drawImage(img, 0, 0);

const map_editor = new MapEditor(canvas)
// map_editor.draw(ctx)
var state_names = map_editor.get_state_names()

function get_random_item(list) {
    if (list.length == 1) return list[0]
    const i = Math.floor(Math.random()*list.length)
    return list[i]
}

const state_name_input = document.getElementById("state_name")
var random_state = get_random_item(state_names)

state_name_input.value = random_state

var correct_count = 0
var incorrect_count = 0

const score_count_input = document.getElementById("score_count")
map_editor.start_game(state_name_input, function(){
    state_names = state_names.filter(s=>random_state!=s)
    
    
    random_state = get_random_item(state_names)
    if (random_state == undefined) {
        // player has selected all states atleast once
        popup.style.display = 'flex'
        document.getElementById("correct_count").textContent = correct_count
        document.getElementById("incorrect_count").textContent = incorrect_count
    }
    state_name_input.value = random_state
    score_count_input.value = Number.parseInt(score_count_input.value)+1
    correct_audio.play()
    correct_count++
}, function(){
    score_count_input.value = Number.parseInt(score_count_input.value)-1
    incorrect_audio.play()
    incorrect_count++

})

function animate() {
    map_editor.draw(ctx)
    requestAnimationFrame(animate)
}

animate()
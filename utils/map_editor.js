class MapEditor {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.hover_state = null;

    this.edit_mode = false;

    this.play_mode = true;

    this.states = this.load_states();

    this.game_element_to_read;
    this.game_success_callback
    this.game_incorrect_callback

    this.currentState = new State();
    this.#addEventListeners();

    this.state_names = this.get_state_names();
  }

  load_states() {
    if (localStorage.getItem("states")) {
      const states = [];
      this.saved_states = JSON.parse(localStorage.getItem("states"));
      for (var saved_state of this.saved_states) {
        const points = [];
        saved_state.points.map((p) => points.push(new Point(p.x, p.y)));
        const state = new State(saved_state.name, points);
        state.center = state.findCenter(points);
        states.push(state);
      }
      return states;
    } else return [];
  }

  get_state_names() {
    return this.states.map((s) => s.name);
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousemove", (event) => {
      const [x, y] = [event.offsetX, event.offsetY];
      const mouse_point = new Point(x, y);
      const nearest_state = this.find_nearest_state(mouse_point);
      this.hover_state = nearest_state;
    });
    this.canvas.addEventListener("mousedown", (event) => {
      if (event.button == 2) this.download_states_data();

      // mouse location
      const [x, y] = [event.offsetX, event.offsetY];
      if (event.button == 0) {
        if (this.edit_mode) this.edit_add_state(x, y);
        if (this.play_mode && this.hover_state)
          this.#play_game(this.hover_state);
      }
    });
  }

  edit_add_state(x, y) {
    const status = this.currentState.add_point(new Point(x, y));
    if (!status) {
      const state_name = prompt("Provide A State Name: ");
      this.currentState.name = state_name;
      this.try_add_save_state(this.currentState)
        ? alert(`${state_name} Saved!!, Total States = ${this.states.length}`)
        : null;
    }
  }

  start_game(element_to_read, game_success_callback, game_incorrect_callback) {
    this.play_mode = true;
    this.game_element_to_read = element_to_read;
    this.game_success_callback = game_success_callback;
    this.game_incorrect_callback = game_incorrect_callback;
  }

  #play_game(clicked_state) {
    if (this.game_element_to_read.value == clicked_state.name) this.game_success_callback();
    else this.game_incorrect_callback();
  }

  download_states_data() {
    const map_data = {
      width: 720,
      height: 835,
      states_data: this.states,
    };
    const a = document.createElement("a");
    a.download = prompt("What should be name of json file ?") + ".json";
    var file = new Blob([JSON.stringify(map_data)], {
      type: "application/json",
    });

    a.href = URL.createObjectURL(file);
    a.click();
  }

  find_nearest_state(point) {
    const near_states = [];
    for (var state of this.states) {
      if (point.isNear(state.center, 100)) {
        near_states.push(state);
      }
    }

    var min_d = Number.MAX_VALUE;
    var nearest_state = null;
    for (var state of near_states) {
      const d = point.distance(state.center);
      if (d < min_d) {
        min_d = d;
        nearest_state = state;
      }
    }

    return nearest_state;
  }

  try_add_save_state(state_to_save = null) {
    if (state_to_save && state_to_save.name)
      this.states.push(this.currentState);
    localStorage.setItem("states", JSON.stringify(this.states));
    this.currentState = new State();
  }

  cleanData() {
    const states_to_remove = [null, "Raj", "Uttrakhand"];
    for (var state_to_remove of states_to_remove) {
      this.states = this.states.filter(
        (state) => state.name != state_to_remove
      );
    }
    this.try_add_save_state();
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var state of this.states) {
      state.draw(ctx);
    }
    if (this.currentState.points.length) {
      this.currentState.draw(ctx, true);
    }
    if (this.hover_state) {
      this.hover_state.draw(ctx, true);
    }
  }
}

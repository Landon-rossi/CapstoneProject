import numpy as np
import matplotlib.pyplot as plt
import os
import argparse
import pickle

# Setup output directory
output_dir = os.path.join(os.getcwd(), "public", "graphs")
os.makedirs(output_dir, exist_ok=True)

STATE_FILE = "model_state.pkl"

def save_image(fig, filename):
    path = os.path.join(output_dir, filename)
    fig.savefig(path)
    print(filename)
    plt.close(fig)

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "rb") as f:
            return pickle.load(f)
    return {}

def save_state(state):
    with open(STATE_FILE, "wb") as f:
        pickle.dump(state, f)

def plot_line(m, b, color, title, filename):
    x = np.linspace(-10, 10, 100)
    y = m * x + b
    fig, ax = plt.subplots()
    ax.plot(x, y, label=title, color=color)
    ax.set_title(title)
    ax.legend()
    save_image(fig, filename)

def default_run():
    param_list = [
        (1, 4, 'red', "Line 1", "line_1.png"),
        (1, -4, 'blue', "Line 2", "line_2.png"),
        (-1, 4, 'green', "Line 3", "line_3.png"),
        (-1, -4, 'orange', "Line 4", "line_4.png"),
        (2, 1, 'purple', "Line 5", "line_5.png"),
        (2, -1, 'brown', "Line 6", "line_6.png"),
        (-2, 1, 'pink', "Line 7", "line_7.png"),
        (-2, -1, 'gray', "Line 8", "line_8.png"),
        (0, 5, 'olive', "Line 9", "line_9.png"),
        (0, -5, 'cyan', "Line 10", "line_10.png")
    ]
    for m, b, color, title, filename in param_list:
        plot_line(m, b, color, title, filename)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--step", type=int, help="Step number (1-10)")
    parser.add_argument("--m", type=float, help="Slope")
    parser.add_argument("--b", type=float, help="Y-intercept")
    args = parser.parse_args()

    if args.step:
        # Single step run from frontend with parameters
        m = args.m if args.m is not None else 1
        b = args.b if args.b is not None else 0
        colors = ["red", "blue", "green", "orange", "purple", "brown", "pink", "gray", "olive", "cyan"]
        color = colors[(args.step - 1) % len(colors)]
        title = f"Line {args.step}"
        filename = f"line_{args.step}.png"
        plot_line(m, b, color, title, filename)
    else:
        # Run all steps with hardcoded params
        default_run()

if __name__ == "__main__":
    main()

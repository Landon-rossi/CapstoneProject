from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import gradio as gr
from model_runner import predict

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== API route =====
class RunModelRequest(BaseModel):
    input: list  # Input is expected to be: [mode, val1, val2, ..., val7]

@app.post("/run")
async def run_model_api(req: RunModelRequest):
    result = predict(req.input)
    return {"output": result}

# ===== Gradio UI =====
parameter_names = [
    'O7_O6_ratio', 'C6_C4_ratio', 'C6_C5_ratio',
    'Fe_O_ratio', 'O_ave_charge', 'velocity', 'density'
]

gradio_inputs = [
                    gr.Radio(["Simple Wind Classification", "Complex Wind Classification"], label="Classification Mode")
                ] + [gr.Slider(label=name, minimum=0, maximum=1, step=0.000001) for name in parameter_names]

demo = gr.Interface(fn=predict, inputs=gradio_inputs, outputs="text")

# Mount Gradio on /gradio AFTER other routes
app = gr.mount_gradio_app(app, demo, path="/gradio")

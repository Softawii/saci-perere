# chatbot-model


## How to install

> With CUDA
```
conda create --name saci python=3.8
conda activate saci
conda install pytorch cudatoolkit=11.6 -c pytorch -c nvidia -y
pip install -r requirements.txt
```

> Without CUDA
```
conda create --name saci python=3.8
conda activate saci
conda install pytorch -c pytorch -y
pip install -r requirements.txt
```

## How to run

```
uvicorn main:app --reload --port 9000
```

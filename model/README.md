# API do Modelo

## Requisitos

- [conda/miniconda](https://docs.conda.io//)

## Como instalar

### Com CUDA

```bash
conda create --name saci python=3.8
conda activate saci
conda install pytorch cudatoolkit=11.6 -c pytorch -c nvidia -y
pip install -r requirements.txt
```

### Sem CUDA

```bash
conda create --name saci python=3.8
conda activate saci
conda install pytorch -c pytorch -y
pip install -r requirements.txt
```

## Como executar

```bash
uvicorn main:app --reload --port 9000
```

# Apple Silicon specific
if [ "$(whoami)" == "elijahsorensen" ];
then
    source ~/miniforge3/etc/profile.d/conda.sh
    export PYENCHANT_LIBRARY_PATH=/opt/homebrew/lib/libenchant-2.dylib
fi

# Intel specific
if [ "$(whoami)" == "nataliehahle" ];
then
    source ~/anaconda/etc/profile.d/conda.sh
fi

# Activate the conda environment
conda activate sd-env
cd src/stable-diffusion-webui

delimiter="################################################################"

printf "\n%s\n" "${delimiter}"
printf "\e[1m\e[32mRunning AlgoRhythm backend...\n"
printf "\e[1m\e[34mEli Sorensen & Natalie Hahle\e[0m"
printf "\n%s\n" "${delimiter}"

python launch.py  --skip-torch-cuda-test --no-half --use-cpu all --api
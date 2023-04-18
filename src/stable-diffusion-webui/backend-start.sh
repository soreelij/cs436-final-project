# Apple Silicon specific
if [ "$(whoami)" == "elijahsorensen" ];
then
    source ~/miniforge3/etc/profile.d/conda.sh
    export PYENCHANT_LIBRARY_PATH=/opt/homebrew/lib/libenchant-2.dylib
    conda activate sd-env
fi

# Intel specific
if [ "$(whoami)" == "nataliehahle" ];
then
    source ~/sd-env/bin/activate
fi

# Activate the conda environment
cd src/stable-diffusion-webui

delimiter="################################################################"

printf "\n%s\n" "${delimiter}"
printf "\e[1m\e[32mRunning AlgoRhythm backend...\n"
printf "\e[1m\e[34mEli Sorensen & Natalie Hahle\e[0m"
printf "\n%s\n" "${delimiter}"

python3 launch.py  --skip-torch-cuda-test --no-half --use-cpu all --api
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Embedding, GRU

from tensorflow.keras.losses import sparse_categorical_crossentropy
from tensorflow.keras.callbacks import ModelCheckpoint

import pandas as pd
import numpy as np
import os
import time

# Tagging expressions
import nltk
import re 
from nltk import pos_tag
import nltk.stem.snowball as stem

# Checking if a word is in the English Dictionary
import enchant
d = enchant.Dict("en_US")

from random import randrange

# Remove warnings
import warnings
warnings.filterwarnings('ignore')

charIndex = {}
indexChar = {}

def get_model():
    album_name = pd.read_csv('album_text.csv')
    album_name = album_name.set_index('Unnamed: 0')
    album_name.dropna(inplace=True)

    words = set(nltk.corpus.words.words())

    # Get english text only
    def isEnglish(s):
        try:
            s.encode(encoding='utf-8').decode('ascii')
        except UnicodeDecodeError:
            return False
        else:
            for w in s:
                chars = set('({=~<=@#=%&+,-/:>[.*_|')
                if any((c in chars) for c in w):
                    return False
    #         return True
            # bypasses other languages
            for w in nltk.wordpunct_tokenize(s):
                if w.lower() in words or not w.isalpha():
                    i = 0
                else:
                    return False
            return True

    album_name['english?'] = [isEnglish(name) for name in album_name['album_name']]

    album_name = album_name[album_name['english?'] == True]

    # makes it a list
    name_list = album_name['album_name'].tolist() 

    name_lower = []
    # case lowering of the entire list
    for name in name_list:
        low = name.lower()
        name_lower.append(low)
    # removes duplicates
    name_lower = list(set(name_lower))


    terms = name_lower
    text = ''
    for t in terms:
        text=text+' ' +t
    text = text[1::]
    # The unique characters in the file
    vocab = sorted(set(text))
    global char2idx 
    char2idx = {u:i for i, u in enumerate(vocab)}
    global idx2char 
    idx2char = np.array(vocab)


    text_as_int = np.array([char2idx[c] for c in text])
    # Creating a mapping from unique characters to indices
    char2idx = {u:i for i, u in enumerate(vocab)}
    idx2char = np.array(vocab)

    charIndex = char2idx
    indexChar = idx2char

    text_as_int = np.array([char2idx[c] for c in text])
    seq_length = 100
    examples_per_epoch = len(text)//(seq_length+1)

    # Create training examples / targets
    char_dataset = tf.data.Dataset.from_tensor_slices(text_as_int)
    sequences = char_dataset.batch(seq_length+1, drop_remainder=True)
    def split_input_target(chunk):
        input_text = chunk[:-1]
        target_text = chunk[1:]
        return input_text, target_text

    dataset = sequences.map(split_input_target)
    # Batch size
    BATCH_SIZE = 32


    BUFFER_SIZE = 10000

    dataset = dataset.shuffle(BUFFER_SIZE).batch(BATCH_SIZE, drop_remainder=True)

    # Length of the vocabulary in chars
    vocab_size = len(vocab)

    # The embedding dimension
    embedding_dim = 100

    # Number of RNN units
    rnn_units = 150
    def build_model(vocab_size, embedding_dim, rnn_units, batch_size):
        model = Sequential()
        model.add(Embedding(vocab_size,embedding_dim, batch_input_shape=[batch_size, None]))
        model.add(GRU(rnn_units, return_sequences=True, stateful=True, recurrent_initializer='glorot_uniform'))
        model.add(Dense(vocab_size))
        
    
        return model
    model = build_model(len(vocab),embedding_dim, rnn_units, BATCH_SIZE)

    def loss(labels, logits):
        return sparse_categorical_crossentropy(labels, logits, from_logits=True)

    model.compile(optimizer='adam', loss=loss,run_eagerly=True)
    # Directory where the checkpoints will be saved
    checkpoint_dir = './training_checkpoints'
    # Name of the checkpoint files
    checkpoint_prefix = os.path.join(checkpoint_dir, "ckpt_{epoch}")

    checkpoint_callback = ModelCheckpoint(
        filepath=checkpoint_prefix,
        save_weights_only=True)

    model = build_model(vocab_size, embedding_dim, rnn_units, batch_size=1)

    model.load_weights(tf.train.latest_checkpoint(checkpoint_dir))

    model.build(tf.TensorShape([1, None]))
    return model


def generate_text(model, start_string,t):
    # Evaluation step (generating text using the learned model)

    # Number of characters to generate
    num_generate = 30

    # Converting our start string to numbers (vectorizing)
    input_eval = [char2idx[s] for s in start_string]
    input_eval = tf.expand_dims(input_eval, 0)

    text_generated = []

    # Low temp = predictable text.
    # Higher temp = more surprising text.
    temperature = t

    model.reset_states()
    for i in range(num_generate):
        predictions = model(input_eval)
        # remove the batch dimension
        predictions = tf.squeeze(predictions, 0)

        # using a categorical distribution to predict the character returned by the model
        predictions = predictions / temperature
        predicted_id = tf.random.categorical(predictions, num_samples=1)[-1,0].numpy()

        # Pass the predicted character as the next input to the model
        # along with the previous hidden state
        input_eval = tf.expand_dims([predicted_id], 0)

        text_generated.append(idx2char[predicted_id])

    return (start_string + ''.join(text_generated))



def get_5_ablums(model, phrase, tempz):
    phrase = phrase.lower()
    # Gets top 10,000 most common words (filters out subtle words that are not in english)
    _20k = pd.read_csv('10k.txt',delimiter='\t', names=['word','la'])
    _20k = _20k.drop(columns=['la'])
    relevant = _20k['word'].tolist()
    _20k.head(5)

    top_20z = pd.read_csv('top_tags.csv')
    top_20z.head(5)
    top_20 = top_20z['Top Tags']
    top_20 = top_20.tolist()


    gen_one_word = []
    count = 0 
    while count < 75:
        sss = generate_text(model, start_string=phrase,t=tempz)
        gen_one_word.append(sss)
        count = count + 1
    gen_names = pd.DataFrame()
    gen_names['temp: 0'] = gen_one_word

    # Parses through each generated temperature to get best generated output
    w = 0
    final_names = []
    while w < 1:
        # =====================================================================
        # Part I: Organizing/Finding Possible Tag Sequences
        # =====================================================================
        
        # Gets the data from the right column
        str_num = str(w)
        column_name = 'temp: ' + str_num
        temp = pd.DataFrame()
        temp['name'] = gen_names[column_name]

        # Parses the generated text into a list of tokens
        lower = list(map(lambda x: x.lower().split(), temp['name']))
        temp['Token'] = lower

        # Gets the POS tagging of each word within the generated text
        tag_sentence = list()
        for array in lower:
            tag = pos_tag(array)
            tags_only = [x[1] for x in tag]
            tag_sentence.append(tags_only) 

        # Turns the tag array into a tag string
        tag_string = []
        for listz in tag_sentence:
            tag = " ".join(listz)
            tag_string.append(tag) 
        temp['Tag'] = tag_string

        # Checks if a tag sequence of most popular titles matches a tag sequence of the generated title
        greater_list = []
        for gen_tag in temp['Tag']:
            tags_found = []
            for tag in top_20:
                # Gets length of tag
                tag_len = len(tag)
                shortenz = gen_tag[0:tag_len]
                # If the tag sequences match, add that tag to a list
                if shortenz == tag:
                    tags_found.append(shortenz)
            # Appends each found sub tag sequence to the title for tracking
            greater_list.append(tags_found)
        temp['Found'] = greater_list
        # Makes a new DataFrame with the titles and their discovered tag sequence
        newer = temp[['name','Found']].copy()

        # Removes entries that had no found tag sequence
        newer['Found'] = newer['Found'].apply(
            lambda x: 'NaN' if len(x)==0 else x)
        newer = newer[newer['Found'] != 'NaN']
        
        # =====================================================================
        # Part II: Filtering/Refining the Generated Text
        # =====================================================================
        
        # Filters out words that don't make sense/aren't in the English Dictionary
        truth_list = []
        for name in newer['name']:
            # Each name starts out as True
            nope = 1
            name_list = name.split()
            for word in name_list: 
                truth = d.check(word)
                if word == 'i':
                    nope = 0
                # If word is not in the English Dictionary then flags
                if truth is False:
                    nope = 0
            truth_list.append(nope)
        # Appends all flags to DataFrame and removes gibberish
        newer['real'] = truth_list
        filtered = newer[newer['real'] == 1]

        # Grabs the length of the tag sequence for word retrieval
        size = []
        # Gets each row
        for row in filtered.index:
            # Gets each title in row
            title = filtered['name'][row]
            # Gets the tag list
            tag_list = filtered['Found'][row]
            pairs = []
            for tag_found in tag_list:
                tag_word = tag_found.split()
                lem = len(tag_word)
                pairs.append(lem)
            size.append(pairs)
        filtered['size'] = size

        # Gets the shortened phrases according to the tag length's sequence
        new_phrases = []
        for row in filtered.index:
            title = filtered['name'][row]
            # Gets the tag list
            size = filtered['size'][row]
            title_split = title.split()
            for each_size in size:
                shorter = []
                i = 0
                while(i < each_size):
                    shorter.append(title_split[i])
                    i = i + 1           
                short_word = ' '.join(shorter)
                new_phrases.append(short_word)
        possible_title = pd.DataFrame()
        possible_title['possible'] = new_phrases

        # Removes uncommon words (e.g. weird English words that pass the first filter)
        commonality = []
        for title in possible_title['possible']:
            title_split = title.split()
            common = 1
            for word in title_split:
                if(word not in relevant):
                    common = 0
            commonality.append(common)
        possible_title['common'] = commonality
        # The final possible titles that make sense as words AND phrases
        possible_title = possible_title[possible_title['common'] == 1]
        possible_title = possible_title.drop(columns=['common'])
        final_names.append(np.array(possible_title['possible'])) 
        w = w + 1

    
    # Puts the phrases into a a DataFrame for easier visualization
    s = pd.Series(final_names) 
    df = pd.DataFrame(s.values.tolist(), index=s.index)
    result = df.transpose()
    result = result.rename(columns={0: 'Words'})
    return result['Words'].unique()



def main():
    model = get_model()
    print()
    print()
    print(get_5_ablums(model,'classical', 0.3))
    print()
    print()

if __name__ == "__main__":
    main()

import os
import pandas as pd
import numpy as np
from IPython.display import display
import matplotlib.pyplot as plt


# Works for both Expectancy & Plausbility and Frame Valence & Arousal
def CombineLists(path):
    os.chdir(path)
    files = [[f for f in fs if f.startswith('List')] for root, dirs, fs in os.walk(path, topdown=True)][0]
    files = sorted(files)
    dataframes = []
    i = 0
    while 1:
        try:
            df1 = pd.concat((pd.read_excel(files[4*i]).transpose().iloc[3:-1],
                             pd.read_excel(files[4*i+1]).transpose().iloc[3:-1]))
            df2 = pd.concat((pd.read_excel(files[4*i+3]).transpose().iloc[3:-1],
                             pd.read_excel(files[4*i+2]).transpose().iloc[3:-1]))
        
            dim1 = pd.concat((df1.iloc[[i for i in range(len(df1)) if i%2==0]].reset_index(),
                              df2.iloc[[i for i in range(len(df2)) if i%2==0]].iloc[::-1].reset_index(drop=True).rename(columns=lambda x: x+len(df1.columns))),
                              axis=1)
            dim2 = pd.concat((df1.iloc[[i for i in range(len(df1)) if i%2!=0]].reset_index(),
                              df2.iloc[[i for i in range(len(df2)) if i%2!=0]].iloc[::-1].reset_index(drop=True).rename(columns=lambda x: x+len(df1.columns))),
                              axis=1)     
            dataframes.append((dim1, dim2))
        
            i += 1
        except IndexError:
            break
    
    combined1, combined2 = dataframes[0][0], dataframes[0][1]
    
    if len(dataframes) >= 2:
        for j in range(1,len(dataframes)):
            combined1 = pd.concat((combined1, dataframes[j][0])).rename(columns=lambda x: 'Ans.'+str(x+1) if type(x)!=str else 'Sentences')
            combined2 = pd.concat((combined2, dataframes[j][1])).rename(columns=lambda x: 'Ans.'+str(x+1) if type(x)!=str else 'Sentences')
            
    else:
        combined1 = combined1.rename(columns=lambda x: 'Ans.'+str(x+1) if type(x)!=str else 'Sentences')
        combined2 = combined2.rename(columns=lambda x: 'Ans.'+str(x+1) if type(x)!=str else 'Sentences')
        
    return combined1, combined2


# Works for both Expectancy & Plausbility and Frame Valence & Arousal
def MeanStd(df, outfile, start=1):
    mean, std = np.empty(len(df)), np.empty(len(df))
    for i in range(len(df)):
        ans = np.array([df.iloc[i][j] for j in range(start,len(df.columns)) if pd.isnull(df.iloc[i][j])==False])
        mean[i], std[i] = np.mean(ans), np.std(ans)
    
    df.insert(len(df.columns), 'mean', mean)
    df.insert(len(df.columns), 'std', std)

    df.to_excel(outfile, index=False)
    print('Rating results (individual dimension) saved as "' + outfile + '" in ' + os.getcwd(), '\n')
    return df


def REINDEX(array):
    '''Sorts sentences by a given index in asencing order'''
    array_ascend = np.sort(array)
    unique, idx = [], []
    for i, x in enumerate(array_ascend):
        if x not in unique:
            idx.append(np.where(array==x)[0].tolist())
            unique.append(x)
    return sum(idx, [])


def CompareExpPlaus(path_to_2nd_ratings_random_sort, exp_res, plaus_res, outfile):
    pwd = os.getcwd()
    os.chdir(path_to_2nd_ratings_random_sort)
    df = pd.concat((pd.read_excel('2nd_ratings_random_sort.xlsx', sheet_name='2nd_List1_plaus_exp')[['Index', 'Sentences', 'Cloze']],
                    pd.read_excel('2nd_ratings_random_sort.xlsx', sheet_name='2nd_List1_plaus_exp')[['Index', 'Sentences', 'Cloze']]))
    df.insert(len(df.columns), 'Exp. mean', exp_res['mean'])
    df.insert(len(df.columns), 'Plaus. mean', plaus_res['mean'])
    df = df[df['Index']!=-1].reset_index(drop=True)
    df = df.reindex(REINDEX(df['Cloze']))
    os.chdir(pwd)
    df.to_excel(outfile, index=False)
    print('Combined results saved as "' + outfile + '" in ' + os.getcwd(), '\n\n')
    return df


def PlotsAndTables(df, scatterName, boxplotName):
    print('CORRELATION')
    display(df[['Exp. mean', 'Plaus. mean']].corr(numeric_only=False))

    figure, axis = plt.subplots(1,2, figsize=(13,5))
    axis[0].scatter(df['Cloze'], df['Exp. mean'])
    axis[0].set_xlabel('Cloze')
    axis[0].set_ylabel('Expectancy')
    axis[0].set_title('Cloze vs Expectancy', fontsize=16)
    axis[1].scatter(df['Plaus. mean'], df['Exp. mean'])
    axis[1].set_title('Plausibility vs Expectancy', fontsize=16)
    axis[1].set_xlabel('Plausibility')
    axis[1].set_ylabel('Expectancy')
    plt.savefig(scatterName)
    print('\n\nScatter plots saved as "' + scatterName + '" in ' + os.getcwd(), '\n')
    plt.show()
    
    E_sent, U_sent = df[df['Cloze'] != 0], df[df['Cloze'] == 0]
    to_plot = [E_sent['Plaus. mean'], U_sent['Plaus. mean'], E_sent['Exp. mean'], U_sent['Exp. mean']]
    xticks = ['Exp. Plausilibity', 'Unexp. Plausibility', 'Exp. Expectancy', 'Unexp. Expectancy']

    figure = plt.figure(figsize =(10, 7))
    plt.boxplot(to_plot)
    plt.xticks([1,2,3,4], xticks)
    plt.savefig(boxplotName)
    print('Box plots saved as "' + boxplotName + '" in ' + os.getcwd(), '\n')
    plt.show()
    
    table = pd.DataFrame({'Exp. Sentences': [E_sent['Plaus. mean'].mean(), E_sent['Exp. mean'].mean()],
                          'Unexp. Sentences': [U_sent['Plaus. mean'].mean(), U_sent['Exp. mean'].mean()]},
                          index=['Plausibility', 'Expectancy'])
    print('\nTABLE')
    display(table)
    
    
def main(pathToResponses, expResName, plausResName, pathToInfo, combinedResName, scatterName, boxplotName):
    '''pathToResponses: the path to the folder in which the response sheets are saved, e.g.,
           if the 8 Expectancy & Plausibility response sheets are in /home/user/exp_plaus_responses
           then pass /home/user/exp_plaus_responses as the first positional argument.
           
       expResName: the results sheet (all participants' answers compiled, lists combined) for Expectancy will be saved
           as an individual file. A file name should be provided, including the file extension, e.g., exp_res.xlsx
           
       plausResName: the results sheet (all participants' answers compiled, lists combined) for Plausibility will be saved
           as an individual file. A file name should be provided, including the file extension, e.g., plaus_res.xlsx
           
       pathToInfo: the path to the folder in which 2nd_ratings_random_sort.xlsx is saved
       
       combinedResName: for Expectancy & Plausibility, we need the cloze for each ending word (which we can extract
           from 2nd_ratings_random_sort.xlsx) and we will also drop the implausible fillers. We thus need a name for
           this file, e.g., combined.xlsx
           
       scatterName: the name of the scatter plot file to be saved, e.g., scatter.png
        
       boxplotName: the name of the scatter plot file to be saved, e.g., boxplot.png'''
     
    exp, plaus = CombineLists(pathToResponses)
    exp_res, plaus_res = MeanStd(exp, expResName), MeanStd(plaus, plausResName)
    combined_res = CompareExpPlaus(pathToInfo, exp_res, plaus_res, combinedResName)
    PlotsAndTables(combined_res, scatterName, boxplotName)

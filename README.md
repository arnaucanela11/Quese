# QUESE

```bash
npm i quese
```

**"Quese"** allows you implement in an easy way a **Search Algoritm, based on Embeddings and Semantic Similarity**, in your JavaScripts apps.
The package is available **in python** (pip) as well: https://pypi.org/project/quese/ <br><br>

### The module provides:<br>

- **Searcher**: a **REACT COMPONENT with a search algoritm and a UI implemented yet**. However, you can customize the search algoritm and the UI of the component by pasing diferent **props**. [More information about the Searcher props below.](#1.-seacher-props:) <br>

- **searchByEmbeddings()**: an **asynchronous FUNCTION** with several **params** to customize the searching process. [More information about the searchByEmbeddings() params below.](#2.-seachbyembeddings()-params:)<br><br>

## COMPATIBILITY

|                        |         **Create React App**         | **Node**                              |
| ---------------------- | :----------------------------------: | ------------------------------------- |
| **Searcher**           | <span style="color:green">YES</span> | <span style="color:red">NO</span>   |
| **searchByEmbeddings** | <span style="color:red">NO</span>  | <span style="color:green">YES </span> |

<br>

## USAGE

### 1. Searcher component:
<br>

![Example of an implementation of the Searcher component.](/assets/SearcherExample.png)

<br>

### 2. searchByEmbeddings function:
<br>

![Example of an implementation of the searchByEmbeddings function.](/assets/searchByExample.png)

<!-- ```
import {searchByEmbeddings} from "quese"

const data_ = [
    {
        title: "UX Designer",
        tags: "Designer"
    },
    {
        title: "Senior Accounter",
        tags: "Accounter"
    },
    {
        title: "Product Manager",
        tags: "Managment"
    }
]

const results = await searchByEmbeddings(data_, "Manager", "title")
//Results will return an ARRAY with the objects whose title is Semantically Similar to the query: "Manager", so in this case, the last object: "Product Manager".
console.log(results)
//Expected: [{title: "Product Manager", tags: "Managment"}]
``` -->
<br>

## PARAMS AND PROPS


### 1. Seacher props:
<br>

| Name                   |                                 Required                                  |             Format             |                                                               Description                                                               | Default value |
| ---------------------- | :-----------------------------------------------------------------------: | :----------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :-----------: |
| **data**               |                  <span style="color:green">true </span>                   |        Array of objects        |                                               Represents the data you want to search for                                                |   undefined   |
| **by**                 |           <span style="color:green">true </span>if not template           |             String             |                 Represents the key of your objects that is going to be compared with the query in the searching process                 |   undefined   |
| **template**           |              <span style="color:green">true </span>if not by              | String, object keys between {} |                     Similar to the "by" prop, allows you to create a customized sentence for compare with the query                     |   undefined   |
| **accuracy**           |                   <span style="color:red">false</span>                    |          Number (0-1)          |                    It represents the minimum similarity rate wich the object must have with the quey to be returned                     |      0.5      |
| **defaultStyle**       |                   <span style="color:red">false</span>                    |            Boolean             |                   Boolean value wich indicates if the default style will be charged or the user prefer her own style                    |     true      |
| **InputStyle**         |                   <span style="color:red">false</span>                    |             Object             |      The typical object for stylize your components in react, but in this case to stylize **the input of the Searcher component**       |   undefined   |
| **ContainerStyle**     |                   <span style="color:red">false</span>                    |             Object             |       The typical object for stylize your components in react, but in this case to stylize **the div of the Searcher component**        |   undefined   |
| **inputClassName**     |                   <span style="color:red">false</span>                    |             String             |                     The typical className prop, but in this case to stylize **the input of the Searcher component**                     |   undefined   |
| **ContainerClassname** |                   <span style="color:red">false</span>                    |             String             |                      The typical className prop, but in this case to stylize **the div of the Searcher component**                      |   undefined   |
| **renderItemFunction** | <span style="color:red">false</span> unless you use the **template** prop |          JSX Function          |     Function with two params: the item and the index, in wich you can customize the structure and the style of the previous results     |   undefined   |
| **itemLinkFunction**   |                   <span style="color:red">false</span>                    |            Function            | Function with two params: the item and the index, in wich you can customize the href of each previous result returning a dinamyc string |   undefined   |
| **onSearchChange**     |                   <span style="color:red">false</span>                    |            Function            |              It's a function to handle the results **for each change** of the input. **The first param are this results.**              |   undefined   |
| **onSearchSubmit**     |                   <span style="color:red">false</span>                    |            Function            |              It's a function to handle the results **for each submit** of the input. **The first param are this results.**              |   undefined   |
| **iconCancel**         |                   <span style="color:red">false</span>                    |            Boolean             |                            Boolean value to define if the icon for cancel the search will be charged or not                             |     true      |
| **iconSearch**         |                   <span style="color:red">false</span>                    |            Boolean             |                                    Boolean value to define if the search icon will be charged or not                                    |     true      |
| **placeholder**        |                   <span style="color:red">false</span>                    |             String             |                                                    The typical input placeholder...                                                     |  "Search..."  |
| **prevResults**        |                   <span style="color:red">false</span>                    |             String             |                 Boolean value to define if the previous results (the results between the input) will be charged or not                  |     true      |

<br><br>

###  2. seachByEmbeddings() params:
<br>

| Name         |                       Required                        |             Format             |                                                                              Description                                                                               |       Default value       |
| ------------ | :---------------------------------------------------: | :----------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------: |
| **data**     |        <span style="color:green">true </span>         |        Array of objects        |                                                               Represents the data you want to search for                                                               |         undefined         |
| **query**    |         <span style="color:green">true</span>         |             String             |                                                             Represents the query of your searching process                                                             |         undefined         |
| **by**       | <span style="color:green">true </span>if not template |             String             |                                Represents the key of your objects that is going to be compared with the query in the searching process                                 |         undefined         |
| **template** |    <span style="color:green">true </span>if not by    | String, object keys between {} |                                    Similar to the "by" prop, allows you to create a customized sentence for compare with the query                                     |         undefined         |
| **accuracy** |         <span style="color:red">false</span>          |          Number (0-1)          |                                    It represents the minimum similarity rate wich the object must have with the quey to be returned                                    |            0.5            |
| **model**    |         <span style="color:red">false</span>          |             String             | The HuggingFace model you want to use to create the embeddings (take care if it works with **Transformers.js** and if it's able to do the **feature-extraction** task) | "Xenova/all-MiniLM-L6-v2" |


<!-- #### **1. data**:

It's the first param, it's **REQUIRED**, and it must be an **array of objects**.

#### **2. query**:

It's the second param, it's **REQUIRED** as well, and it represent the query you want to pass.<br><br>
Type: **string**

#### **3. by**:

It's the third param, it's **only REQUIRED if you don't pass the "template" param, otherwhise, you have to let it as undefined**, and it represent the value of your dictionaries that you are searching for.<br>
For example, if you want to search in a list of products, your "by" param could be the prop "name" of each product.<br><br>
Type: **string**

#### **4. template**:

It's **only REQUIRED if you don't pass the "by" param**, and it's similar to "by", but allow you to search by a customized string for each object in your data array.<br>
For example, if you want to search in an array of products, your "template" param could be a string like this: "{name}, seller: {seller}".
Notice that you have to define your props **between "{}"**, as you can see in the example with the variables **"name"** and **"seller"**.<br><br>
Type: **string**

#### **5. accuracy**:

It's **optional**, and it represents the similarity that the dictionary must have with the query to be considered a result.<br>
**The default value is 0.4**, wich works good with almost all the models. However, if you want to change it, we don't recommend to set vary high values or very low values, the range **0.3-0.6** should be enought.<br><br>
Type: **float number between 0-1**

#### **6. model**:

It's **optional**, and it represents the **embedding model** you want to use.<br>
The default model is **'Xenova/all-MiniLM-L6-v2'**. You can use an other model like 'Xenova/e5-large-v2', but take care because **if the model don't work with Xenova this package will not work with it**.<br><br>
Type: **string** -->

<!-- ## EXAMPLE WITH TEMPLATE

```
import {searchByEmbeddings} from "quese"

const data_ = [
    {
        title: "UX Designer",
        tags: "Designer"
    },
    {
        title: "Senior Accounter",
        tags: "Accounter"
    },
    {
        title: "Product Manager",
        tags: "Managment"
    }
]

const results = await searchByEmbeddings(data_, "Manager", undefined, "{title}, {tags}")
//Results will return an ARRAY with the objects whose title and tags are Semantically Similar to the query: "Manager", so in this case, the last object: "Product Manager". Notice that we are letting the "by" param as undefined.
console.log(results)
//Expected: [{title: "Product Manager", tags: "Managment"}]
``` -->

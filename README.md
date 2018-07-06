
# Audio Explorer 


Audio Explorer is a data visualization tool created by Colin Scruggs and Cameron Henkel of Southwestern University for the [2018 VAST Challenge](http://www.vacommunity.org/VAST+Challenge+2018).  

![logo](public/data/logo_github.png)

This single-page web app was developed as part of our submission to [Mini-Challenge 1](http://www.vacommunity.org/VAST+Challenge+2018+MC1). The main objectives of the mini-challenge were to:  
1) Characterize patterns of all bird species found in the Boonsong Lekagal Wildlife Preserve over time, and   
2) Determine whether or not the set of bird calls provided by the Kasios Furniture company supports their claim that the Rose-Crested Blue Pipit is "happily living and nesting in the Preserve."  

Audio Explorer was built to synthesize the results of our machine-learning experiments and assist us in examining the geospatial data associated with the large dataset of bird calls provided in Mini-Challenge 1. 

For a closer look at how we tackled machine learning, `Bird Classification.ipynb` is included.  
*(NOTE: the mini-challenge audio data is required to run this Jupyterlab notebook, and is available for download from the links above)*

## Live Demo

A live demo of Audio Explorer can be found [here]().

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Install [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com) (if haven't already)

### Installing

Clone the repository. Open terminal/commmand prompt and `cd` to root directory of the repo:
```
cd [repo directory]
```

Type `yarn install` to install dependencies:
```
yarn install
```
## Deployment

To view a development build of Audio Explorer, run:
```
yarn serve
```

Alternatively, to create a production build:
```
yarn build
```

The web app can then be viewed at http://localhost:8080/
## Built With

* [Vue.js](https://vuejs.org/) - Front-end framework
* [Vue CLI](https://cli.vuejs.org/) - Standard tooling for Vue.js development
* [D3.js](https://d3js.org/) - Data processing library
* [Vue2Leafet](https://rometools.github.io/rome/) - Vue wrapper for [Leaflet](https://leafletjs.com/) interactive map library
* [Leatlet.heat](https://github.com/Leaflet/Leaflet.heat) - Heatmap plugin for Leaflet maps
* [wavesurfer.js](https://wavesurfer-js.org/) - Audio visualization and playback plugin
* [vue-slider-component](https://nightcatsama.github.io/vue-slider-component/example/) - Vue slider components
* [vue-sweetalert2](https://github.com/avil13/vue-sweetalert2) - Vue wrapper for [SweetAlert2](https://sweetalert2.github.io/)

## Authors

**Colin Scruggs** - [Github](https://github.com/colinscruggs)

**Cameron Henkel** - [Github](https://github.com/cameron-henkel)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

* [Dr. Chad Stolper](https://github.com/chadstolper/) for guidance throughout SCOPE
* [SCOPE Summer Research Program](https://www.southwestern.edu/scope/) at Southwestern Univeristy
* [Dr. Jaron Collis](https://github.com/jaron) and his deep learning [audio classification experiments](https://github.com/jaron/deep-listening)
import React from 'react';
import * as instancesVal from '../instances_val2017.json';
import {randomColor} from '../interfaces/SortInterfaces';
import {filterData} from '../interfaces/cocoData';
import * as cocoText from '../cocotext.v2.json';


const proceedRandomTextCOCO = () =>{
	const random = Math.round(Math.random() * ((<any>cocoText).anns.length));

	return{
		imageURL:'',
		bboxes:'',
		segments:'',

	};
};


const parseCategories=()=> {
	const classesTemp:any = [];
	(<any>instancesVal).categories.forEach((item: any) => {

		if (!(item.supercategory in classesTemp)) {
			classesTemp[item.supercategory] = [];
		}
		if (!(item.name in classesTemp[item.supercategory])) {
			classesTemp[item.supercategory].push(item.name);
		}
	});
	return classesTemp;
};

export const classes = parseCategories();

export const parseSubCategories = (supercategory: string)=>{
	const categories = (supercategory==='all')? Object.values(classes).flat(): classes[supercategory];
	return categories;
};


function fetchBboxesAndSegments(imageID:number){
	const bboxes:any = [];
	const segments:any = [];

	const annotationForImage = (<any>instancesVal).annotations.filter((annotation: any) => annotation.image_id === imageID);
	annotationForImage.forEach((annotation:any)=>{
		bboxes.push({box: annotation.bbox, category: (<any>instancesVal).categories.find((item: any)=> item.id ===annotation.category_id).name});
		segments.push({area: annotation.area, segments: annotation.segmentation, category: (<any>instancesVal).categories.find((item: any)=> item.id ===annotation.category_id).name   });
	});
	return {bboxes: bboxes, segments: segments};

}


export const getRandomCocoExample = ()=>{

	const random = Math.round(Math.random() * ((<any>instancesVal).images.length));
	const image = (<any>instancesVal).images[random];

	return {
		filename: image.file_name,
		path: 'C:\\',
		url: image.coco_url,
		height: image.height,
		width: image.width,
		info: fetchBboxesAndSegments(image.id),
		showBboxes: false,
		showKeypoints: false
	};


};

export const getFilteredCocoExample = (filter: filterData) =>{
	let classesToSearch: any;

	if(filter.subclasses.length>0 ){
		classesToSearch = (<any>instancesVal).categories.filter((category: any)=> filter.subclasses.includes(category.name) ).map((classes:any)=>classes.id);
	}else {
		classesToSearch = (filter.superclass === 'all') ? (<any>instancesVal).categories.map((classes: any) => classes.id)
			:
			(<any>instancesVal).categories.filter((category: any) => category.supercategory === filter.superclass).map((item: any) => item.id);
	}

	const images_filtered_by_size = (filter.image.width>0 && filter.image.height>0) ?
		(<any>instancesVal).images.filter((image:any)=> image.height<=filter.image.height && image.width<= filter.image.width).map((image:any)=> ({url:image.coco_url, id: image.id, width: image.width, height: image.height, license: image.license}))
		:
		(<any>instancesVal).images.map((image:any)=> ({url: image.coco_url, id: image.id, width: image.width, height: image.height, license: image.license}));

	const annos_filtered_by_ClHs = (<any>instancesVal).annotations.filter((annotation:any)=>
		classesToSearch.includes(annotation.category_id) && images_filtered_by_size.map((image:any)=> image.id).includes(annotation.image_id) );

	let annos_filtered_by_bbox_shape:any;
	if(filter.only===1 || filter.only===3) {
		annos_filtered_by_bbox_shape = (filter.bboxes.maxWidth > 0 && filter.bboxes.maxHeight > 0) ?
			annos_filtered_by_ClHs.filter((anno:any) => Math.abs(anno.bbox[2] - anno.bbox[0]) <= filter.bboxes.maxWidth && Math.abs(anno.bbox[3] - anno.bbox[1]) <= filter.bboxes.maxHeight )
			:
			annos_filtered_by_ClHs;

		annos_filtered_by_bbox_shape = (filter.bboxes.minWidth > 0 && filter.bboxes.minHeight > 0) ?
			annos_filtered_by_bbox_shape.filter((anno:any) => Math.abs(anno.bbox[0] - anno.bbox[2]) >= filter.bboxes.minWidth && filter.bboxes.minHeight <= Math.abs(anno.bbox[1] - anno.bbox[3]))
			:
			annos_filtered_by_bbox_shape;
	}else annos_filtered_by_bbox_shape = annos_filtered_by_ClHs;

	let resultImages = images_filtered_by_size.filter((image:any)=>  annos_filtered_by_bbox_shape.map((anno:any)=> anno.image_id).includes(image.id) );

	resultImages = resultImages.map((image:any)=> ({ url:image.url, id: image.id, width: image.width, height: image.height, license: (<any>instancesVal).licenses.find((license:any) => license.id === image.license).name }));

	resultImages = resultImages.map((image:any) => ({
		filename: image.url.split('/')[4],
		path: filter.path+image.url.split('/')[4],
		url: image.url,
		width: image.width,
		height: image.height,
		license: image.license,
		info:{
			bboxes: (filter.only===1 || filter.only===3)? annos_filtered_by_bbox_shape.filter((anno:any) => anno.image_id === image.id).map((item:any)=>({box:item.bbox, category: (<any>instancesVal).categories.find((category:any)=> category.id === item.category_id).name})) : [],
			segments: (filter.only===2 || filter.only===3)? annos_filtered_by_bbox_shape.filter((anno:any) => anno.image_id === image.id).map((item:any)=>({area: item.area, segments:item.segmentation, category: (<any>instancesVal).categories.find((category:any)=> category.id === item.category_id).name})) : []
		},
		showBboxes: filter.only===1 || filter.only===3,
		showKeypoints: filter.only===2 || filter.only===3
	}) );
	const random = Math.round(Math.random() * resultImages.length);
	return resultImages[random];

};


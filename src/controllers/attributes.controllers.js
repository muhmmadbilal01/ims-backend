import { isValidObjectId } from "mongoose";
import { BrandItem, CategoryItem, ColorItem, ModelItem, NetworkItem, SeriesItem, StorageItem } from "../models/attributes.model.js";
import { validateRequiredFields } from "../utils/validations.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { tryCatch } from "../utils/tryCatch.js";
import { notFound } from "../utils/notFound.js";

//NETWORK
export const getAllNetworkItems = tryCatch(async (req, res) => {
    //getting all the Network items
    const Network = await NetworkItem.find({});

    if (!Network || Network.length === 0) {
        return res.status(404).json({ status: 404, success: false, message: "No Network Found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", Network)
    )
})

export const addNetworkItem = tryCatch(async (req, res) => {
    const { Network, AddedBy } = req.body;
    //checking if any of the field is empty
    validateRequiredFields([Network, AddedBy], res);

    // Create a new Network item
    const newNetworkItem = await NetworkItem.create({
        Network,
        AddedBy,
    });
    //checking if the Network is created or not
    notFound(newNetworkItem, res);


    return res.status(201).json(
        new ApiResponse(200, "Network added successfully", newNetworkItem)
    )
})

export const updateNetworkItem = tryCatch(async (req, res) => {
    const { Network } = req.body;
    const { id } = req.params;

    // Validate that required fields are not empty
    validateRequiredFields([Network], res);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid Edit' });
    }
    // Find the Network item by ID and update it
    const updatedItem = await NetworkItem.findOneAndUpdate(
        { _id: id },
        { Network },
        { new: true }
    );

    notFound(updatedItem, res)

    return res.status(201).json(
        new ApiResponse(200, "Network updated successfully", updatedItem)
    )
})

export const deleteNetworkItem = tryCatch(async (req, res) => {
    const { id } = req.params;

    // Find the Network item by ID and delete it
    const deletedItem = await NetworkItem.findOneAndDelete({ _id: id });

    //checking if the Network is created or not
    notFound(deletedItem, res);

    return res.status(201).json(
        new ApiResponse(200, "Network deleted successfully")
    )
});




//STORAGE
export const getAllStorageItems = tryCatch(async (req, res) => {
    //getting all the Network items
    const Storage = await StorageItem.find({});

    if (!Storage || Storage.length === 0) {
        return res.status(404).json({ status: 404, success: false, message: "No Storage Found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", Storage)
    )
})

export const addStorageItem = tryCatch(async (req, res) => {
    const { Storage, AddedBy } = req.body;
    //checking if any of the field is empty
    validateRequiredFields([Storage, AddedBy], res);

    // Create a new Storage item
    const newStorageItem = await StorageItem.create({
        Storage,
        AddedBy,
    });
    //checking if the Storage is created or not
    notFound(newStorageItem, res);


    return res.status(201).json(
        new ApiResponse(200, "Storage added successfully", newStorageItem)
    )
})

export const updateStorageItem = tryCatch(async (req, res) => {
    const { Storage } = req.body;
    const { id } = req.params;

    // Validate that required fields are not empty
    validateRequiredFields([Storage], res);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid Edit' });
    }
    // Find the Storage item by ID and update it
    const updatedItem = await StorageItem.findOneAndUpdate(
        { _id: id },
        { Storage },
        { new: true }
    );

    notFound(updatedItem, res)

    return res.status(201).json(
        new ApiResponse(200, "Storage updated successfully", updatedItem)
    )
})

export const deleteStorageItem = tryCatch(async (req, res) => {
    const { id } = req.params;

    // Find the Storage item by ID and delete it
    const deletedItem = await StorageItem.findOneAndDelete({ _id: id });

    //checking if the Storage is created or not
    notFound(deletedItem, res);

    return res.status(201).json(
        new ApiResponse(200, "Storage deleted successfully")
    )
});



//BRAND
export const getAllBrandItems = tryCatch(async (req, res) => {
    //getting all the Network items
    const Brand = await BrandItem.find({});

    if (!Brand || Brand.length === 0) {
        return res.status(404).json({ status: 404, success: false, message: "No Brand Found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", Brand)
    )
})

export const addBrandItem = tryCatch(async (req, res) => {
    const { Brand, AddedBy } = req.body;
    //checking if any of the field is empty
    validateRequiredFields([Brand, AddedBy], res);

    // Create a new Brand item
    const newBrandItem = await BrandItem.create({
        Brand,
        AddedBy,
    });
    //checking if the Brand is created or not
    notFound(newBrandItem, res);


    return res.status(201).json(
        new ApiResponse(200, "Brand added successfully", newBrandItem)
    )
})

export const updateBrandItem = tryCatch(async (req, res) => {
    const { Brand } = req.body;
    const { id } = req.params;

    // Validate that required fields are not empty
    validateRequiredFields([Brand], res);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid Edit' });
    }
    // Find the Brand item by ID and update it
    const updatedItem = await BrandItem.findOneAndUpdate(
        { _id: id },
        { Brand },
        { new: true }
    );

    notFound(updatedItem, res)

    return res.status(201).json(
        new ApiResponse(200, "Brand updated successfully", updatedItem)
    )
})

export const deleteBrandItem = tryCatch(async (req, res) => {
    const { id } = req.params;

    // Find the Brand item by ID and delete it
    const deletedItem = await BrandItem.findOneAndDelete({ _id: id });

    //checking if the Brand is created or not
    notFound(deletedItem, res);

    return res.status(201).json(
        new ApiResponse(200, "Brand deleted successfully")
    )
});



//SERIES
export const getAllSeriesItems = tryCatch(async (req, res) => {
    //getting all the Network items
    const Series = await SeriesItem.find({});

    if (!Series || Series.length === 0) {
        return res.status(404).json({ status: 404, success: false, message: "No Series Found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", Series)
    )
})

export const addSeriesItem = tryCatch(async (req, res) => {
    const { Series, AddedBy } = req.body;
    //checking if any of the field is empty
    validateRequiredFields([Series, AddedBy], res);

    // Create a new Series item
    const newSeriesItem = await SeriesItem.create({
        Series,
        AddedBy,
    });
    //checking if the Series is created or not
    notFound(newSeriesItem, res);


    return res.status(201).json(
        new ApiResponse(200, "Series added successfully", newSeriesItem)
    )
})

export const updateSeriesItem = tryCatch(async (req, res) => {
    const { Series } = req.body;
    const { id } = req.params;

    // Validate that required fields are not empty
    validateRequiredFields([Series], res);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid Edit' });
    }
    // Find the Series item by ID and update it
    const updatedItem = await SeriesItem.findOneAndUpdate(
        { _id: id },
        { Series },
        { new: true }
    );

    notFound(updatedItem, res)

    return res.status(201).json(
        new ApiResponse(200, "Series updated successfully", updatedItem)
    )
})

export const deleteSeriesItem = tryCatch(async (req, res) => {
    const { id } = req.params;

    // Find the Series item by ID and delete it
    const deletedItem = await SeriesItem.findOneAndDelete({ _id: id });

    //checking if the Series is created or not
    notFound(deletedItem, res);

    return res.status(201).json(
        new ApiResponse(200, "Series deleted successfully")
    )
});



//COLOR
export const getAllColorItems = tryCatch(async (req, res) => {
    //getting all the Network items
    const Color = await ColorItem.find({});

    if (!Color || Color.length === 0) {
        return res.status(404).json({ status: 404, success: false, message: "No Color Found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", Color)
    )
})

export const addColorItem = tryCatch(async (req, res) => {
    const { Color, AddedBy } = req.body;
    //checking if any of the field is empty
    validateRequiredFields([Color, AddedBy], res);

    // Create a new Color item
    const newColorItem = await ColorItem.create({
        Color,
        AddedBy,
    });
    //checking if the Color is created or not
    notFound(newColorItem, res);


    return res.status(201).json(
        new ApiResponse(200, "Color added successfully", newColorItem)
    )
})

export const updateColorItem = tryCatch(async (req, res) => {
    const { Color } = req.body;
    const { id } = req.params;

    // Validate that required fields are not empty
    validateRequiredFields([Color], res);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid Edit' });
    }
    // Find the Color item by ID and update it
    const updatedItem = await ColorItem.findOneAndUpdate(
        { _id: id },
        { Color },
        { new: true }
    );

    notFound(updatedItem, res)

    return res.status(201).json(
        new ApiResponse(200, "Color updated successfully", updatedItem)
    )
})

export const deleteColorItem = tryCatch(async (req, res) => {
    const { id } = req.params;

    // Find the Color item by ID and delete it
    const deletedItem = await ColorItem.findOneAndDelete({ _id: id });

    //checking if the Color is created or not
    notFound(deletedItem, res);

    return res.status(201).json(
        new ApiResponse(200, "Color deleted successfully")
    )
});


//CATEGORY
export const getAllCategoryItems = tryCatch(async (req, res) => {
    //getting all the Network items
    const Category = await CategoryItem.find({});

    if (!Category || Category.length === 0) {
        return res.status(404).json({ status: 404, success: false, message: "No Category Found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", Category)
    )
})

export const addCategoryItem = tryCatch(async (req, res) => {
    const { Category, AddedBy } = req.body;
    //checking if any of the field is empty
    validateRequiredFields([Category, AddedBy], res);

    // Create a new Category item
    const newCategoryItem = await CategoryItem.create({
        Category,
        AddedBy,
    });
    //checking if the Category is created or not
    notFound(newCategoryItem, res);


    return res.status(201).json(
        new ApiResponse(200, "Category added successfully", newCategoryItem)
    )
})

export const updateCategoryItem = tryCatch(async (req, res) => {
    const { Category } = req.body;
    const { id } = req.params;

    // Validate that required fields are not empty
    validateRequiredFields([Category], res);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid Edit' });
    }
    // Find the Category item by ID and update it
    const updatedItem = await CategoryItem.findOneAndUpdate(
        { _id: id },
        { Category },
        { new: true }
    );

    notFound(updatedItem, res)

    return res.status(201).json(
        new ApiResponse(200, "Category updated successfully", updatedItem)
    )
})

export const deleteCategoryItem = tryCatch(async (req, res) => {
    const { id } = req.params;

    // Find the Category item by ID and delete it
    const deletedItem = await CategoryItem.findOneAndDelete({ _id: id });

    //checking if the Category is created or not
    notFound(deletedItem, res);

    return res.status(201).json(
        new ApiResponse(200, "Category deleted successfully")
    )
});



//MODEL
export const getAllModelItems = tryCatch(async (req, res) => {
    //getting all the Network items
    const Model = await ModelItem.find({});

    if (!Model || Model.length === 0) {
        return res.status(404).json({ status: 404, success: false, message: "No Model Found" })
    }

    return res.status(200).json(
        new ApiResponse(200, "", Model)
    )
})

export const addModelItem = tryCatch(async (req, res) => {
    const { Model, Brand, AddedBy } = req.body;
    //checking if any of the field is empty
    validateRequiredFields([Model, Brand, AddedBy], res);

    // Create a new Model item
    const newModelItem = await ModelItem.create({
        Model,
        Brand,
        AddedBy
    });
    //checking if the Model is created or not
    notFound(newModelItem, res);


    return res.status(201).json(
        new ApiResponse(200, "Model added successfully", newModelItem)
    )
})

export const updateModelItem = tryCatch(async (req, res) => {
    const { Model, Brand } = req.body;
    const { id } = req.params;

    // Validate that required fields are not empty
    validateRequiredFields([Model, Brand], res);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: 400, success: false, message: 'Invalid Edit' });
    }
    // Find the Model item by ID and update it
    const updatedItem = await ModelItem.findOneAndUpdate(
        { _id: id },
        { Model, Brand },
        { new: true }
    );

    notFound(updatedItem, res)

    return res.status(201).json(
        new ApiResponse(200, "Model updated successfully", updatedItem)
    )
})

export const deleteModelItem = tryCatch(async (req, res) => {
    const { id } = req.params;

    // Find the Model item by ID and delete it
    const deletedItem = await ModelItem.findOneAndDelete({ _id: id });

    //checking if the Model is created or not
    notFound(deletedItem, res);

    return res.status(201).json(
        new ApiResponse(200, "Model deleted successfully")
    )
});
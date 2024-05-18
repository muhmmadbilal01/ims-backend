//Resuable func to check that the coming array fields are not empty
function validateRequiredFields(fields, res) {
    if (fields.some((field) => field === null || field === undefined || (typeof field === 'string' && field.trim() === ""))) {
        return res.status(400).json({ status: 400, success: false, message: "All input fields are required!" });
    }
}
export { validateRequiredFields };
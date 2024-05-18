export const notFound = (data, res) => {
    if (!data) {
        return res.status(404).json({ status: 404, success: false, message: `Not found!` })
    }
}
exports.paginationHelper = (counts, offsets, limit) => {
    const metaData = {}
    const count = counts
    const countByLimit = limit || 1
    const offset = offsets ? offsets - 1 : 0
    const totalPages = Math.ceil(count / countByLimit)
    const skip = limit * offset || 0
    metaData.limit = Number(limit) || 0
    metaData.offset = Math.ceil(skip / countByLimit) + 1 
    metaData.total_page = limit ? totalPages : 1
    metaData.skip = skip 
    return metaData
}
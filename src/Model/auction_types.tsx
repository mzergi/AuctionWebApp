export type AuctionItem = {
    id: number,
    topBidder: User,
    name: string,
    product: Product,
    topBid: Bid,
    description: string,
    startOfAuction: Date,
    endOfAuction: Date,
    bids: Bid[],
    startingPrice: number,
    highlighted: boolean,
    createdBy: User
}
export type CreateAuctionItem = {
    productId: number,
    description: string,
    startOfAuction: Date,
    endOfAuction: Date,
    startingPrice: number,
    highlighted: boolean,
    createdById: number
}

export type User = {
    id: number,
    password: string,
    email: string,
    balance: number,
    name: string,
    birth: Date
}
export type Bid = {
    id: number,
    biddedAmount: number,
    bidder: User,
    auctionID: number,
    bidderID: number,
    bidTime: Date
}
export type Product = {
    id: number,
    name: string,
    category: Category,
    imagePath: string,
    categoryID: number
}
export type Category = {
    id: number,
    name: string,
    children: Category[],
    parentCategoryID: number
}

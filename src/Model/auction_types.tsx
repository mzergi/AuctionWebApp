export type AuctionItem = {
    id: number,
    top_bidder: User,
    name: string,
    product: Product,
    highest_bid: number,
    description: string
}
export type User = {
    id: number,
    wallet: number,
    email: string,
    bids: Bid[]
}
export type Bid = {
    auction: AuctionItem,
    bidder: User
}
export type Product = {
    id: number,
    name: string,

}
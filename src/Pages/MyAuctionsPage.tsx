import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Col,
  Row,
  Container,
  CardGroup,
  Button,
  Form,
  Modal,
  Card,
  Spinner,
  Table,
} from "react-bootstrap";
import ItemDisplayPage from "./ItemDisplayPage";
import {
  AuctionItem,
  Bid,
  Category,
  IIndexable,
  Product,
  User,
} from "../Model/auction_types";
import { useAppSelector, useAppDispatch } from "../App/hooks";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import "../styles/auctionspage_styles.css";
import { store } from "../App/store";
import { setDisplayed } from "../Reducers/AuctionDetailsReducer";
import { Link } from "react-router-dom";
import moment from "moment";
import { FaEdit, FaTrash } from "react-icons/fa";
import placeholder from "../assets/placeholder.jpg";
import { FaSearch } from "react-icons/fa";

export default function MyAuctionsPage() {
  const [modalProduct, setProduct] = useState({} as Product);
  const [modalProductId, setProductId] = useState(0);
  const [loadedProducts, setLoadedProducts] = useState([] as Product[]);
  const [loadedCategories, setLoadedCategories] = useState([] as Category[]);
  const [productCategory, setProductCategory] = useState({} as Category);
  const [inputCategoryId, setCategoryId] = useState(0);
  const [modalProductCategory, setModalProductCategory] = useState(
    {} as Category
  );
  const [auctions, setAuctions] = useState([] as AuctionItem[]);
  const [filteredAuctions, setFilteredAuctions] = useState(auctions);
  const [modalAuction, setModalAuction] = useState({} as AuctionItem);
  const [showModal, setShowModal] = useState(false);
  const [modalBid, setModalBid] = useState(0);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState({} as Category);

  const [newProductModalIsOpen, setNewProductModalIsOpen] = useState(false);

  const [auctionImage, setImage] = useState(placeholder);
  const [createImage, setCreateImage] = useState({} as File);
  const [auctionImageUrl, setImageUrl] = useState("");

  const [searchQuery, setSearch] = useState("");

  const userId = useAppSelector((state) => state.loginstate.user.id);

  const url = "http://localhost:5000/api/auctionspage/auctions/created-by/";
  const updateUrl = "http://localhost:5000/api/auctionspage/auctions/";
  const baseUrl = "http://localhost:5000/api/";
  const imageUrl = "http://localhost:5000/api/auctionspage/auctions/image";

  const fetchData = async () => {
    const result = await axios(url.concat(userId.toString()));

    setAuctions([...result.data]);
    setFilteredAuctions([...result.data]);
  };

  const connection = useAppSelector((state) => state.connection.connection);

  connection.on("bidReceived", async () => {
    await fetchData();
  });

  useEffect(() => {
    (async () => {
      await fetchData();
      let products = await axios.get(baseUrl + "auctionspage/products");
      setLoadedProducts(products.data);
      let categories = await axios.get(baseUrl + "auctionspage/categories");
      setLoadedCategories(categories.data);
    })();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
        setFilteredAuctions([...auctions]);
    }
    else {
        setFilteredAuctions(auctions.filter(a => a.product.name.toLowerCase().includes(searchQuery.toLowerCase()) 
        || a.product.category.name.toLowerCase().includes(searchQuery.toLowerCase()) 
        || a.description.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  }, [searchQuery]);

  function updateModalAuction(value: any, prop: string) {
    var tmp = modalAuction;
    (tmp as IIndexable)[prop] = value;
    setModalAuction({ ...tmp });
  }

  function findHighestBidByUser(auction: AuctionItem): number {
    let highest = 0;
    auction?.bids?.forEach((b) => {
      if (b.bidderID == userId) {
        if (b.biddedAmount > highest) {
          highest = b.biddedAmount;
        }
      }
    });
    return highest;
  }

  function imageSelected(e: any) {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      setCreateImage(file);
      const reader = new FileReader();
      reader.onload = (x) => {
        if (x && x.target) {
          setImage(x.target.result as any);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setImage(placeholder);
    }
  }

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setProduct({} as Product);
    setProductId(0);
    setProductCategory({} as Category);
    setCategoryId(0);
    setModalProductCategory({} as Category);
    setImageUrl("");
  }
  async function updateAuction() {
    const formData = new FormData();
    formData.append("imageFile", createImage);
    const image = await axios.post(imageUrl, formData, {
      headers: { "Content-Type": "application/json" },
    });
    if (image) {
      modalAuction.imageUrl = image.data;
      const result = await axios.put(
        updateUrl + modalAuction?.id,
        modalAuction
      );
      await fetchData();
      closeModal();
    }
  }

  const handleClick = (item: AuctionItem) => {
    setModalAuction({ ...item });
    const currentImageUrl = item.imageUrl
      ? "http://localhost:5000/images/" + item.imageUrl
      : placeholder;
    setImageUrl(currentImageUrl);
    console.log(currentImageUrl);
    setImage(currentImageUrl);
    setShowModal(true);
  };

  async function CategorySelected(categoryId: number) {
    if (categoryId !== 0) {
      var category = await axios.get(
        baseUrl + "auctionspage/categories/" + categoryId
      );
      var productsOfCategory = await axios.get(
        baseUrl + "auctionspage/products/category/" + categoryId
      );

      let old = loadedProducts;
      old = productsOfCategory.data;

      setLoadedProducts([...old]);
      setProductCategory({ ...category.data });
      setCategoryId(categoryId);
      setModalProductCategory({ ...category.data });
    }
  }

  function SetNewProductCategoryById(id: number) {
    let category = loadedCategories.find((c) => c.id === id);

    setNewProductCategory(category as Category);
  }

  function setProductFromId(id: number) {
    if (id !== 0) {
      let product = loadedProducts.find((p) => p.id == id);

      updateModalAuction(product as Product, "product");
      updateModalAuction(id, "productId");
      setProductId(id);
    }
  }

  function openNewProductModal() {
    setNewProductModalIsOpen(true);
  }
  function closeNewProductModal() {
    setNewProductModalIsOpen(false);
  }

  async function CreateProduct() {
    let createdProduct = await axios.post(
      baseUrl + "auctionspage/products",
      {
        name: newProductName,
        category: newProductCategory,
        imagePath: "",
        categoryID: newProductCategory.id,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    setProduct({ ...createdProduct.data });
    setProductCategory({ ...newProductCategory });
    let loaded = loadedProducts;
    loaded.push(createdProduct.data);
    setLoadedProducts([...loaded]);
    setProductId(createdProduct.data.id);
    closeNewProductModal();
  }

  async function deleteAuction(id: number) {
    const res = (
      await axios.delete(baseUrl + "auctionspage/auctions/" + id.toString())
    ).data;
    if (res) {
      let items = [...auctions];
      items.splice(
        items.findIndex((item) => item.id === id),
        1
      );
      setAuctions([...items]);
    }
  }

  return (
    <Container fluid>
      <Row className={"justify-content-center mt-4"}>
        <Col sm={8}></Col>
        <Col sm={4}>
          <Form>
            <Form.Group
              as={Row}
              controlId="searchBar"
              className="tableSearchBarWrapper"
            >
              <Col sm={9} className="pr-2 mt-2">
                <Form.Control
                  type="text"
                  placeholder="Filter items..."
                  className="tableSearchBarInput"
                  value={searchQuery}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
              <Form.Label column sm={1}>
                <FaSearch
                  style={{ color: "darkgray", marginBottom: "0.35rem" }}
                />
              </Form.Label>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Table bordered hover>
        <thead>
          <tr>
            <th colSpan={9}>Your auctions</th>
          </tr>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Current bid</th>
            <th>Starting price</th>
            <th>Start of auction</th>
            <th>End of auction</th>
            <th>Highlighted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAuctions.map((a, index) => (
            <tr className={"table-row"}>
              <td>{index + 1}</td>
              <td>{a.product.name}</td>
              <td>{a.description}</td>
              <td>
                {a.topBid?.biddedAmount
                  ? a.topBid?.biddedAmount
                  : "No bids yet."}
              </td>
              <td>{a.startingPrice}</td>
              <td>{a.startOfAuction}</td>
              <td>{a.endOfAuction}</td>
              <td>{a.highlighted ? "Yes" : "No"}</td>
              <td>
                {Date.now() < new Date(a?.endOfAuction).getTime() && (
                  <FaEdit
                    onClick={() => handleClick(a)}
                    className="ml-1"
                  ></FaEdit>
                )}
                {(Date.now() < new Date(a?.startOfAuction).getTime() ||
                  !a?.topBid?.biddedAmount) && (
                  <FaTrash
                    className="ml-3"
                    onClick={async () => {
                      await deleteAuction(a?.id);
                    }}
                  ></FaTrash>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={
          showModal &&
          Date.now() < new Date(modalAuction?.endOfAuction).getTime()
        }
        onHide={closeModal}
      >
        <Modal.Header>
          <Modal.Title>{modalAuction?.product?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{ marginTop: "1%" }} inline>
            <Row>
              <Col xs={6}>
                <img
                  src={auctionImage}
                  alt="edit-image"
                  className="edit-image"
                />
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Upload image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={imageSelected}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mt-2">
              <Form.Label className="my-1 mr-3">Category</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    as="select"
                    className="my-1 mr-sm-3"
                    custom
                    onChange={async (e) => {
                      await CategorySelected(parseInt(e.target.value));
                    }}
                    disabled={
                      Date.now() >
                      new Date(modalAuction?.startOfAuction).getTime()
                    }
                  >
                    <option value="0">Choose category</option>
                    {loadedCategories.map((category) => (
                      <option value={category.id}>{category.name}</option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>
          </Form>
          <Form>
            <Form.Group>
              <Form.Label>Select Product</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      setProductFromId(parseInt(e.currentTarget.value));
                    }}
                    value={modalProduct.id}
                    disabled={
                      inputCategoryId === 0 ||
                      Date.now() >
                        new Date(modalAuction?.startOfAuction).getTime()
                    }
                    custom
                  >
                    <option value="0">Choose Product</option>
                    {loadedProducts.map((product) => (
                      <option value={product.id}>{product.name}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col>
                  <Button
                    variant="success"
                    onClick={openNewProductModal}
                    disabled={
                      Date.now() >
                      new Date(modalAuction?.startOfAuction).getTime()
                    }
                  >
                    New product
                  </Button>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="edit_description"
                disabled={!!modalAuction?.topBid?.biddedAmount}
                as="textarea"
                value={modalAuction?.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateModalAuction(e.currentTarget.value, "description");
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Starting price</Form.Label>
              <Form.Control
                name="edit_starting_price"
                disabled={!!modalAuction?.topBid?.biddedAmount}
                type="number"
                value={modalAuction?.startingPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateModalAuction(e.currentTarget.value, "startingPrice");
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Start of auction</Form.Label>
              <Form.Control
                name="edit_start_of_auction"
                disabled={
                  Date.now() > new Date(modalAuction?.startOfAuction).getTime()
                }
                type="date"
                value={moment(new Date(modalAuction?.startOfAuction)).format(
                  "YYYY-MM-DD"
                )}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateModalAuction(
                    new Date(
                      moment(e.currentTarget.value).format("YYYY-MM-DD")
                    ),
                    "startOfAuction"
                  );
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>End of auction</Form.Label>
              <Form.Control
                name="edit_end_of_auction"
                disabled={
                  Date.now() < new Date(modalAuction?.endOfAuction).getTime()
                }
                type="date"
                value={moment(new Date(modalAuction?.endOfAuction)).format(
                  "YYYY-MM-DD"
                )}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateModalAuction(
                    new Date(
                      moment(e.currentTarget.value).format("YYYY-MM-DD")
                    ),
                    "endOfAuction"
                  );
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Highlight auction"
                checked={modalAuction?.highlighted}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateModalAuction(e.target.checked, "highlighted");
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={"primary"}
            onClick={async () => {
              updateAuction();
            }}
          >
            Update
          </Button>
          <Button
            variant={"secondary"}
            onClick={async () => {
              closeModal();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={newProductModalIsOpen} onHide={closeNewProductModal}>
        <Modal.Header>
          <Modal.Title>Create new Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newProductName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewProductName(e.currentTarget.value);
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  SetNewProductCategoryById(parseInt(e.currentTarget.value));
                }}
                defaultValue={inputCategoryId}
              >
                <option value="0">Choose category</option>
                {loadedCategories.map((category) => (
                  <option value={category.id}>{category.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeNewProductModal}>
            Close
          </Button>
          <Button variant="success" onClick={CreateProduct}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

import React from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import qs from 'qs';
import Categories from "../components/Categories";
import Sort, {sortList} from "../components/Sort";
import {Skeleton} from "../components/PizzaBlock/Skeleton";
import Index from "../components/PizzaBlock";
import Pagination from "../components/Pagination";
import {SearchContext} from "../App";
import {setCategoryId, setCurrentPage, setFilters} from "../redux/FilterSlice/filterSlice";
import {fetchPizzas} from "../redux/FilterSlice/pizzaSlice";

const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const isSearch = React.useRef(false)
    const isMounted = React.useRef(false)

    const categoryId = useSelector(state => state.filter.categoryId);
    const sortType = useSelector(state => state.filter.sort.sortProperty)
    const currentPage = useSelector(state => state.filter.currentPage)
    const {items, status} = useSelector(state => state.pizza)

    const {searchValue} = React.useContext(SearchContext)
    // const [isLoading, setIsLoading] = React.useState(true)

    const onChangeCategory = (id) => {
        dispatch(setCategoryId(id))
    }

    const onChangePage = (number) => {
        dispatch(setCurrentPage(number))
    }

    const getPizzas = async () => {

        const sortBy = sortType.replace("-", "");
        const order = sortType.includes("-") ? 'asc' : 'desc';
        const category = categoryId > 0 ? `category=${categoryId}` : "";
        const search = searchValue ? `&search=${searchValue}` : "";

        dispatch(fetchPizzas({
            sortBy,
            order,
            category,
            search,
            currentPage
        }))

        window.scrollTo(0, 0)
    }

// esli bil perviy render to proverayem URL-parametri i soxranayem v redux
    React.useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1))

            const sort = sortList.find(obj => obj.sortProperty === params.sortProperty);

            dispatch(setFilters({
                ...params,
                sort
            }))
            isSearch.current = true
        }
    }, [])

    //esli bil perviy render, to zaprawivayem picci
    React.useEffect(() => {
        getPizzas()
    }, [categoryId, sortType, searchValue, currentPage])

    // esli izmenili parametri i bil perviy render
    React.useEffect(() => {
        if(isMounted.current) {
            const queryString = qs.stringify({
                sortProperty: sortType,
                categoryId,
                currentPage
            })

            navigate(`?${queryString}`)

        }
        isMounted.current = true
    }, [categoryId, sortType, currentPage])

    const pizzas = items.filter((obj) => {
        if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
            return true;
        }
        return false
    }).map((obj) => <Index key={obj.id} {...obj} />)

    const skeleton = [...new Array(6)].map((_, index) => <Skeleton key={index}/>)

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={onChangeCategory}/>
                <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            {
                status === 'error' ?
                    <div className="content__error-info">
                        <h2>Proizowla Owibka</h2>
                        <p>OOOPPSS</p>
                    </div>
                    :
                    <div className="content__items"> {status === "loading" ? skeleton : pizzas} </div>
            }
            <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
        </div>
    );
};

export default Home;
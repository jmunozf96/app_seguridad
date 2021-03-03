import React from "react"
import Pagination from '@material-ui/lab/Pagination';

const TableComponent = (props) => {
    const { cols, paginate, last_page, changePage, children } = props;

    return (
        <React.Fragment>
            <div className="col-12 m-0 table-responsive">
                <table className="table table-bordered table-hovered">
                    <thead className="table-md text-center">
                        <tr>
                            {cols.map((data, i) => (
                                <th key={i}>{data}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="table-sm">
                        {children}
                    </tbody>
                </table>
            </div>
            <div className="col-12">
                <div className="d-flex justify-content-end">
                    {paginate &&
                        <Pagination
                            count={last_page}
                            variant="outlined"
                            shape="rounded"
                            onChange={(e, value) => changePage(e, value)}
                        />
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

export default TableComponent
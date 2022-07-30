import "../css/bootstrap.min.css";
import "../css/bootstrap.min.css.map";


export default function Addresses(props) {
    return (
        <div id="addressTemplate">
            <div className="container">
                <div className="row" id="address_div">
                    <div style={{marginLeft: '15px', marginTop: '10px'}}>
                        <span> Address: </span>
                        <select id="enter_address" onChange={props.handleSelect}>                         
                            {props.options.map(item => {
                                return (
                                    <option key={item.id} value={item.address}>{item.address}</option>
                                )
                            }
                            )}

                        </select>
                    </div><br />
                </div>
                <button className="btn btn-success" type="button" id="win-count" style={{float: 'right', marginRight: '5px'}} onClick={props.handleWinner}>Declare Winner</button><br />
                <div className="row" id="register_div">
                    <div style={{marginLeft: '15px'}}>
                        <button className="btn btn-info" type="button" id="register" onClick={props.handleRegister}>Register</button>
                    </div>
                </div><br /><br />
                <div className="row" id="count_div">
                    <div style={{marginLeft: '15px'}}>
                        <button className="btn btn-info" type="button" id="votecount" onClick={props.getCount}>Get Count</button>
                    </div>
                </div><br />
            </div>
        </div>
  
    );
}   
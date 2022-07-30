import "../css/bootstrap.min.css";
import "../css/bootstrap.min.css.map";


export default function Proposals(props) {
    return (
        <div id="proposalTemplate">
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="panel panel-default panel-proposal">
                    <div className="panel-heading">
                        <h3 className="panel-title">{props.item.name}</h3>
                    </div>
                    <div className="panel-body">
                        <img alt="140x140" data-src="holder.js/140x140" className="img-rounded img-center" style={{width: '100%', height: '150px'
                        }} src={props.item.picture} data-holder-rendered="true"/>
                        <br/><br/>
                        <button className="btn btn-default btn-vote" type="button" data-id={props.item.id} onClick={props.handleVote}>Vote</button>
                    </div>
                </div>
            </div>
        </div>
    );
}   
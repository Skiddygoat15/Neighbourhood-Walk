// components/RequestBox.js
function RequestBox({onAccept,onReject}){
    return (
        <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto mt-5 border border-gray-300">
            <div className="pb-2">
                <p className="text-lg font-medium text-center">A request from Emma</p>
            </div>
            <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between mt-2">
                    <button
                        className="flex-1 bg-gray-300 text-black py-2 px-4 rounded-l hover:bg-gray-400
                        transition duration-300 ease-in-out focus:outline-none focus:shadow-outline">
                        Accept
                    </button>
                    <button
                        className="flex-1 bg-gray-300 text-black py-2 px-4 rounded-r hover:bg-gray-400
                        transition duration-300 ease-in-out focus:outline-none focus:shadow-outline">
                        Reject
                    </button>
                </div>
            </div>
        </div>
    )
}
export default RequestBox;

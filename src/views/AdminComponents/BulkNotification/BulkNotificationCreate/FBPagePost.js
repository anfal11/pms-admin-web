import { Fragment } from "react"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { ChevronLeft, Plus } from 'react-feather'

const CreateFaceBookPagePostTemplate = ({
    c, 
    userInput, 
    handleChange, 
    businesscategorylist,
    catRef,
    handleChangeFBCategory,
    handleChangeFBSubCategory,
    uploadImg,
    fbfilePrevw,
    setFbFilePrevw,
    instafilePrevw,
    setInstaFilePrevw,
    subCategory,
    fbSelectdCategory,
    fbSelectdSubCategory,
    handleChangeInstaCategory,
    handleChangeInstaSubCategory,
    instasubCategory,
    instaSelectdCategory,
    instaSelectdSubCategory

}) => {

    return (
        <Fragment>
            <Row className='pr-3'>
                <Col sm="12" >
                    <FormGroup>
                        <Label for="body">body<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="textarea"
                            name={c.key_name === 'fb_page_post' ? "fb_page_post_body" : "instagram_body"}
                            id='fb_page_post_body'
                            value={c.key_name === 'fb_page_post' ? userInput.fb_page_post_body : userInput.instagram_body}
                            onChange={handleChange}
                            required
                            placeholder="your message"
                        />
                    </FormGroup>
                </Col>
                <Col md='6' sm='6'>
                    <FormGroup>
                        <Label for='fb_page_post_category_ids'>Facebook Page Category <span style={{ color: 'red' }}>*</span></Label>
                        {
                            businesscategorylist.length ? <Select
                                ref={catRef}
                                theme={selectThemeColors}
                                className='basic-multi-select'
                                classNamePrefix='select'
                                name="businesscategories"
                                defaultValue={c.key_name === 'fb_page_post' ? fbSelectdCategory : instaSelectdCategory}
                                options={businesscategorylist}
                                onChange={(selected) => {
                                    return c.key_name === 'fb_page_post' ? handleChangeFBCategory(selected) : handleChangeInstaCategory(selected)
                                }}
                                isMulti
                                isClearable={false}
                            
                            /> : <Spinner color='primary' />
                        }
                        <Input
                            required
                            style={{
                                opacity: 0,
                                width: "100%",
                                height: 0
                                // position: "absolute"
                            }}
                            onFocus={e => catRef.current.select.focus()}
                            value={userInput.fb_page_post_category_ids || ''}
                            onChange={e => ''}
                        />
                    </FormGroup>
                </Col>

                {
                    (subCategory?.length !== 0) && c.key_name === 'fb_page_post' && <Col sm="4" >
                    <FormGroup>
                        <Label for="facebookpage_subcategory_localuid">Facebook Page Sub Category</Label>
                        <Select
                            theme={selectThemeColors}
                            maxMenuHeight={200}
                            className='react-select'
                            classNamePrefix='select'
                            defaultValue={fbSelectdSubCategory}
                            onChange={(selected) =>  handleChangeFBSubCategory(selected)}
                            isMulti
                            isClearable={false}
                            options={subCategory?.map(item => { return { value: item.uid, label: item.name } })}
                            
                        />
                    </FormGroup>
                </Col>
                }

                {
                    (instasubCategory?.length !== 0) && c.key_name === 'instagram' && <Col sm="4" >
                    <FormGroup>
                        <Label for="facebookpage_subcategory_localuid">Facebook Page Sub Category</Label>
                        <Select
                            theme={selectThemeColors}
                            maxMenuHeight={200}
                            className='react-select'
                            classNamePrefix='select'
                            defaultValue={instaSelectdSubCategory}
                            onChange={(selected) => handleChangeInstaSubCategory(selected)}
                            isMulti
                            isClearable={false}
                            options={instasubCategory?.map(item => { return { value: item.uid, label: item.name } })}
                            
                        />
                    </FormGroup>
                </Col>
                }

                <Col md='12' className='mb-1'>
                    <Label for="voucherImage">Upload Image</Label>
                    <div className='d-flex'>
                        <div className="file position-relative overflow-hidden mr-2">
                            <div className='text-center p-1' style={{
                                height: '102px',
                                width: '102px',
                                border: '1px dashed #d9d9d9',
                                backgroundColor: "#fafafa"
                            }}>
                                <span ><Plus size={20} className='my-1' /></span> <br />
                                <span>Upload</span>
                            </div>
                            <Input
                                // style={{ width: '300px' }}
                                style={{
                                    position: 'absolute',
                                    opacity: '0',
                                    left: '0',
                                    top: '0',
                                    height: '102px',
                                    width: '102px',
                                    cursor: 'pointer'
                                }}
                                type="file"
                                accept="image/png, image/jpeg"
                                // required
                                name="voucherImage"
                                id='voucherImage'
                                onChange={e => {
                                    uploadImg(e.target.files[0], c.key_name === 'fb_page_post' ? 'fb_page_post_image' : 'instagram_image', c.key_name === 'fb_page_post' ? setFbFilePrevw : setInstaFilePrevw)
                                }}
                            />
                        </div>
                        {(fbfilePrevw && c.key_name === 'fb_page_post') ? <img src={fbfilePrevw} alt='voucher img' height='100px'></img> : (instafilePrevw && c.key_name === 'instagram') ? <img src={instafilePrevw} alt='voucher img' height='100px'></img> : null}
                    </div>
                </Col>
            </Row>
        </Fragment>
    )
}

export default CreateFaceBookPagePostTemplate
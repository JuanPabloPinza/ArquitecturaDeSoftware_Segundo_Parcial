
package ec.edu.gr03.controller;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for traerBalancesResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="traerBalancesResponse"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="cuenta" type="{http://controller.gr03.edu.ec/}cuenta" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "traerBalancesResponse", propOrder = {
    "cuenta"
})
public class TraerBalancesResponse {

    protected List<Cuenta> cuenta;

    /**
     * Gets the value of the cuenta property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the cuenta property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getCuenta().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Cuenta }
     * 
     * 
     */
    public List<Cuenta> getCuenta() {
        if (cuenta == null) {
            cuenta = new ArrayList<Cuenta>();
        }
        return this.cuenta;
    }

}
